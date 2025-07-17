"use server";
import db from "./db";
import { getKoreaMidnight } from "./getKoreaTime";

export async function getClubDiary(clubid: number) {
    const data = await db.clubDiary.findMany({
        where: {
            userid: clubid,
        },
    });
    return data;
}

export async function getPlayersFromClub(clubid: number) {
    console.log("clubID from server : ", clubid);
    const data = await db.playerDiary.findMany({
        where: {
            userid: clubid,
        },
        select: {
            name: true,
            id: true,
            grade: true,
            gender: true,
            age: true,
            avater: true,
            mmr: true,
            clubid: true,
            isMe: true,
            lastGameDate: true,
        },
        orderBy: [
            {
                isMe: "desc",
            },
            {
                lastGameDate: {
                    sort: "desc",
                    nulls: "last",
                },
            },
        ],
    });

    return data;
}

export async function makeMatch(
    players: number[],
    userid: number,
    clubid: number,
    winner1id?: number,
    winner2id?: number,
    score1?: number,
    score2?: number,
    startTime?: Date,
    endTime?: Date
) {
    console.log(players, userid, clubid, winner1id, winner2id, score1, score2, startTime, endTime);
    const data = await db.matchDiary.create({
        data: {
            clubid,
            userid,
            players,
            ...{ winner1id, winner2id, score1, score2, startTime, endTime },
        },
    });
    // 한번의 쿼리로 여러 플레이어의 마지막 게임 날짜를 업데이트합니다.
    await db.playerDiary.updateMany({
        where: {
            id: {
                in: players,
            },
        },
        data: {
            lastGameDate: new Date(),
        },
    });

    return data;
}

export async function getWinToday(userid: number) {
    const meid = await db.playerDiary.findFirst({
        where: {
            userid: userid,
            isMe: true,
        },
        select: {
            id: true,
        },
    });

    if (!meid) return [0, 0, 0, 0];
    const todayStart = getKoreaMidnight();
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const wins = await db.matchDiary.count({
        where: {
            userid: userid,
            createat: {
                gte: todayStart,
                lt: todayEnd,
            },
            OR: [{ winner1id: meid.id }, { winner2id: meid.id }],
        },
    });

    // 데이터베이스에서 직접 패배 횟수를 계산합니다.
    const loses = await db.matchDiary.count({
        where: {
            userid: userid,
            createat: {
                gte: todayStart,
                lt: todayEnd,
            },
            players: { has: meid.id },
            NOT: {
                OR: [{ winner1id: meid.id }, { winner2id: meid.id }],
            },
        },
    });

    // 득점과 실점을 계산하기 위해 모든 관련 경기를 가져옵니다.
    // 이 부분도 더 최적화할 수 있지만, 일단 승/패 계산부터 개선합니다.
    const matches = await db.matchDiary.findMany({
        where: {
            userid: userid,
            createat: {
                gte: todayStart,
                lt: todayEnd,
            },
            players: { has: meid.id },
            score1: { not: null },
            score2: { not: null },
        },
    });

    let point = 0;
    let loss = 0;
    matches.forEach((match) => {
        const isTeam1 = match.players[0] === meid.id || match.players[1] === meid.id;
        if (isTeam1) {
            point += match.score1!;
            loss += match.score2!;
        } else {
            point += match.score2!;
            loss += match.score1!;
        }
    });

    return [wins, loses, point, loss];
}

export async function getWin(userid: number) {
    const meid = await db.playerDiary.findFirst({
        where: {
            userid: userid,
            isMe: true,
        },
        select: {
            id: true,
        },
    });

    if (!meid) return [0, 0, 0, 0];

    // 데이터베이스에서 직접 승리 횟수를 계산합니다.
    const wins = await db.matchDiary.count({
        where: {
            userid: userid,
            OR: [{ winner1id: meid.id }, { winner2id: meid.id }],
        },
    });

    // 데이터베이스에서 직접 패배 횟수를 계산합니다.
    const loses = await db.matchDiary.count({
        where: {
            userid: userid,
            players: { has: meid.id },
            NOT: {
                OR: [{ winner1id: meid.id }, { winner2id: meid.id }],
            },
        },
    });

    // 득점과 실점을 계산하기 위해 모든 관련 경기를 가져옵니다.
    // 이 부분도 더 최적화할 수 있지만, 일단 승/패 계산부터 개선합니다.
    const matches = await db.matchDiary.findMany({
        where: {
            userid: userid,
            players: { has: meid.id },
            score1: { not: null },
            score2: { not: null },
        },
    });

    let point = 0;
    let loss = 0;
    matches.forEach((match) => {
        const isTeam1 = match.players[0] === meid.id || match.players[1] === meid.id;
        if (isTeam1) {
            point += match.score1!;
            loss += match.score2!;
        } else {
            point += match.score2!;
            loss += match.score1!;
        }
    });

    return [wins, loses, point, loss];
}

export async function getMatch(userid: number) {
    const datas = await db.matchDiary.findMany({
        where: {
            userid: userid,
        },
        orderBy: {
            createat: "desc",
        },
    });

    if (datas.length === 0) {
        return [];
    }

    // 모든 경기에 포함된 모든 선수 ID를 중복 없이 수집합니다.
    const playerIds = new Set<number>();
    datas.forEach((data) => {
        data.players.forEach((id) => playerIds.add(id));
        if (data.winner1id) playerIds.add(data.winner1id);
        if (data.winner2id) playerIds.add(data.winner2id);
    });

    // 단 한 번의 쿼리로 모든 선수 정보를 가져옵니다.
    const playersData = await db.playerDiary.findMany({
        where: {
            id: {
                in: Array.from(playerIds),
            },
        },
    });

    // 선수 ID를 키로 하는 맵을 만들어 쉽게 찾을 수 있도록 합니다.
    const playersMap = new Map(playersData.map((p) => [p.id, p]));

    // 메모리에서 데이터를 조합하여 최종 결과를 만듭니다.
    return datas.map((data) => ({
        ...data,
        players: data.players.map((id) => playersMap.get(id)).filter(Boolean), // filter(Boolean) to remove undefined
        winner1: data.winner1id ? playersMap.get(data.winner1id) ?? null : null,
        winner2: data.winner2id ? playersMap.get(data.winner2id) ?? null : null,
    }));
}
