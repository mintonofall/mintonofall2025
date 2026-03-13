"use server";
import db from "./db";
import { getKoreaMidnight } from "./getKoreaTime";

/**
 * 특정 클럽의 다이어리 정보를 가져옵니다.
 * @param {number} clubid - 클럽 ID
 * @returns {Promise<any[]>} 클럽 다이어리 데이터 배열
 */
export async function getClubDiary(clubid: number) {
    const data = await db.clubDiary.findMany({
        where: {
            userid: clubid,
        },
    });
    return data;
}

/**
 * 특정 클럽에 속한 모든 선수 목록을 가져옵니다.
 * isMe (본인) 여부와 마지막 게임 날짜를 기준으로 정렬합니다.
 * @param {number} clubid - 클럽 ID
 * @returns {Promise<any[]>} 선수 정보 배열
 * @deprecated 현재 `getUserGoHome.ts`의 `getClub` 함수가 선수 목록을 포함하여 반환하므로, 직접 사용되는 경우는 적을 수 있습니다.
 * 하지만 `diary` 페이지 등에서 직접 사용될 수 있습니다.
 */
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
    console.log(data);
    return data;
}

/**
 * 새로운 경기(Match)를 생성하고, 참여한 선수들의 마지막 게임 날짜를 업데이트합니다.
 * @param {number[]} players - 경기에 참여한 모든 선수의 ID 배열
 * @param {number} userid - 작업을 수행하는 사용자(클럽 관리자)의 ID
 * @param {number} clubid - 클럽 ID
 * @param {number} [winner1id] - 승리팀 선수1 ID
 * @param {number} [winner2id] - 승리팀 선수2 ID
 * @param {number} [score1] - 팀1 점수
 * @param {number} [score2] - 팀2 점수
 * @param {Date} [startTime] - 경기 시작 시간
 * @param {Date} [endTime] - 경기 종료 시간
 * @returns {Promise<any>} 생성된 경기 데이터
 */
export async function makeMatch(
    players: number[],
    userid: number,
    clubid: number,
    winner1id?: number,
    winner2id?: number,
    score1?: number,
    score2?: number,
    startTime?: Date,
    endTime?: Date,
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

/**
 * 특정 사용자의 오늘 경기 승/패, 득/실점을 계산하여 반환합니다.
 * @param {number} userid - 사용자(클럽 관리자) ID
 * @returns {Promise<[number, number, number, number]>} [승, 패, 득점, 실점] 배열
 */
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

/**
 * 특정 사용자의 전체 경기 승/패, 득/실점을 계산하여 반환합니다.
 * @param {number} userid - 사용자(클럽 관리자) ID
 * @returns {Promise<[number, number, number, number]>} [승, 패, 득점, 실점] 배열
 */
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

/**
 * 특정 클럽의 모든 경기 기록을 가져옵니다.
 * N+1 문제를 해결하기 위해, 모든 선수 정보를 한 번의 쿼리로 가져온 후 메모리에서 조합합니다.
 * @param {number} userid - 사용자(클럽 관리자) ID, 실제로는 클럽 ID로 사용되어야 할 수 있습니다. (현재는 userid로 되어있음)
 * @returns {Promise<any[]>} 선수 정보가 포함된 경기 기록 배열
 */
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
        winner1: data.winner1id ? (playersMap.get(data.winner1id) ?? null) : null,
        winner2: data.winner2id ? (playersMap.get(data.winner2id) ?? null) : null,
    }));
}
