"use server";
import db from "./db";
import { getKoreaMidnight } from "./getKoreaTime";
import type { MatchDiary, Prisma } from "@prisma/client"; // MatchDiary는 여전히 필요, Prisma 타입 추가
import type { MatchDiaryWithPlayers, PlayerDiary } from "./types"; // 새로 생성한 types.ts에서 임포트

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
 * 사용자의 ClubDiary를 가져오고, 없으면 새로 생성합니다.
 * 경기 기록(MatchDiary)은 ClubDiary에 연결되어야 하므로, 아직 ClubDiary가 없는 사용자가
 * 경기를 기록하려 할 때 이 함수로 자동 생성합니다.
 * @param {number} userid - 사용자 ID
 */
export async function getOrCreateClubDiary(userid: number) {
    const existing = await db.clubDiary.findFirst({ where: { userid } });
    if (existing) return existing;

    const user = await db.user.findUnique({
        where: { id: userid },
        select: { userName: true, nickName: true },
    });
    const clubName = user?.nickName || user?.userName || `${userid}번 다이어리`;

    return db.clubDiary.create({
        data: { userid, clubName },
    });
}

/**
 * 주어진 경기(Match, 클럽 게임판 기준) 중 사용자가 이미 다이어리에 저장한 경기 ID 목록을 반환합니다.
 * @param {number} userid - 사용자 ID
 * @param {number[]} matchIds - 확인할 Match ID 목록
 * @returns {Promise<number[]>} 이미 저장된 Match ID 목록
 */
export async function getSavedDiaryMatchIds(userid: number, matchIds: number[]) {
    if (matchIds.length === 0) return [];
    const saved = await db.matchDiary.findMany({
        where: { userid, sourceMatchId: { in: matchIds } },
        select: { sourceMatchId: true },
    });
    return saved.map((m) => m.sourceMatchId).filter((id): id is number => id !== null);
}

/**
 * 클럽 게임판(Match)의 경기 결과를 사용자의 개인 다이어리(MatchDiary)에 저장합니다.
 * 선수는 이름을 기준으로 기존 PlayerDiary를 찾고, 없으면 새로 생성합니다.
 * @param {number} userid - 사용자 ID
 * @param {number} matchId - 저장할 Match의 ID
 */
export async function saveMatchToMyDiary(userid: number, matchId: number) {
    const existing = await db.matchDiary.findFirst({
        where: { userid, sourceMatchId: matchId },
    });
    if (existing) {
        return { alreadySaved: true, matchDiaryId: existing.id };
    }

    const match = await db.match.findUnique({ where: { id: matchId } });
    if (!match) {
        return { error: "경기 정보를 찾을 수 없습니다." };
    }

    const originalPlayerIds = [match.player1id, match.player2id, match.player3id, match.player4id];
    const clubPlayers = await db.player.findMany({ where: { id: { in: originalPlayerIds } } });
    const clubPlayerMap = new Map(clubPlayers.map((p) => [p.id, p]));

    const clubDiary = await getOrCreateClubDiary(userid);

    // 클럽에서는 코트 자리(player1~4)가 팀 편성을 의미하지 않고 승자를 자유롭게 고르므로,
    // 다이어리의 "앞 2명 = 한 팀, 뒤 2명 = 다른 팀" 규칙에 맞춰 승리팀을 앞으로 재정렬합니다.
    let playerIds = originalPlayerIds;
    if (match.winner1id != null && match.winner2id != null) {
        const winners = [match.winner1id, match.winner2id];
        const losers = originalPlayerIds.filter((id) => !winners.includes(id));
        playerIds = [...winners, ...losers];
    }

    // 클럽 선수를 이름 기준으로 기존 PlayerDiary와 매칭하고, 없으면 새로 만듭니다.
    const diaryPlayerIds: number[] = [];
    for (const pid of playerIds) {
        const clubPlayer = clubPlayerMap.get(pid);
        if (!clubPlayer) {
            return { error: "선수 정보를 찾을 수 없습니다." };
        }
        let diaryPlayer = await db.playerDiary.findFirst({
            where: { userid, name: clubPlayer.name },
        });
        if (!diaryPlayer) {
            diaryPlayer = await db.playerDiary.create({
                data: {
                    userid,
                    clubid: clubDiary.id,
                    name: clubPlayer.name,
                    age: clubPlayer.age,
                    grade: clubPlayer.grade,
                    gender: clubPlayer.gender,
                    avater: clubPlayer.avater,
                },
            });
        }
        diaryPlayerIds.push(diaryPlayer.id);
    }

    const winnerIndex1 = match.winner1id != null ? playerIds.indexOf(match.winner1id) : -1;
    const winnerIndex2 = match.winner2id != null ? playerIds.indexOf(match.winner2id) : -1;

    const created = await db.matchDiary.create({
        data: {
            userid,
            club: { connect: { id: clubDiary.id } },
            players: diaryPlayerIds,
            winner1id: winnerIndex1 !== -1 ? diaryPlayerIds[winnerIndex1] : undefined,
            winner2id: winnerIndex2 !== -1 ? diaryPlayerIds[winnerIndex2] : undefined,
            score1: match.score1 ?? undefined,
            score2: match.score2 ?? undefined,
            startTime: match.startTime,
            endTime: match.endTime ?? match.startTime,
            sourceMatchId: match.id,
        },
    });

    return { success: true, matchDiaryId: created.id };
}

/**
 * 여러 경기(Match)를 한 번에 사용자의 개인 다이어리에 저장합니다.
 * 각 경기는 `saveMatchToMyDiary`와 동일한 로직으로 저장되며, 이미 저장된 경기는 건너뜁니다.
 * @param {number} userid - 사용자 ID
 * @param {number[]} matchIds - 저장할 Match ID 목록
 */
export async function saveMatchesToMyDiary(userid: number, matchIds: number[]) {
    let savedCount = 0;
    let alreadySavedCount = 0;
    let failedCount = 0;

    for (const matchId of matchIds) {
        const result = await saveMatchToMyDiary(userid, matchId);
        if (result.success) savedCount += 1;
        else if (result.alreadySaved) alreadySavedCount += 1;
        else failedCount += 1;
    }

    return { savedCount, alreadySavedCount, failedCount };
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
            userid: true,
            grade: true,
            gender: true,
            age: true,
            avater: true,
            mmr: true,
            clubid: true,
            isMe: true,
            lastGameDate: true,
            createdAt: true,
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
 * 다이어리 선수 정보를 수정합니다.
 * @param {number} id - 수정할 선수(PlayerDiary)의 ID
 * @param {{ name: string; age: number | null; grade: string; gender: string }} data - 수정할 필드
 */
export async function updatePlayerDiary(
    id: number,
    data: { name: string; age: number | null; grade: string; gender: string },
) {
    const result = await db.playerDiary.update({
        where: { id },
        data,
    });
    return result;
}

/**
 * 다이어리 선수를 삭제합니다.
 * @param {number} id - 삭제할 선수(PlayerDiary)의 ID
 */
export async function deletePlayerDiary(id: number) {
    const result = await db.playerDiary.delete({
        where: { id },
    });
    return result;
}

/**
 * 선수 목록 중 한 명을 "주인공"(isMe)으로 지정합니다. 기존 주인공은 해제됩니다.
 * @param {number} userid - 사용자(클럽 관리자) ID
 * @param {number} playerId - 주인공으로 지정할 선수(PlayerDiary)의 ID
 */
export async function setMainPlayer(userid: number, playerId: number) {
    await db.$transaction([
        db.playerDiary.updateMany({
            where: { userid, isMe: true },
            data: { isMe: false },
        }),
        db.playerDiary.update({
            where: { id: playerId },
            data: { isMe: true },
        }),
    ]);
    return { success: true };
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

    const now = new Date();
    const createData: Prisma.MatchDiaryCreateInput = {
        club: {
            connect: {
                id: clubid,
            },
        },
        userid,
        players,
        startTime: now,
        endTime: now,
    };

    if (winner1id !== undefined) createData.winner1id = winner1id;
    if (winner2id !== undefined) createData.winner2id = winner2id;
    if (score1 !== undefined) createData.score1 = score1;
    if (score2 !== undefined) createData.score2 = score2;
    if (startTime !== undefined) createData.startTime = startTime;
    if (endTime !== undefined) createData.endTime = endTime;

    const data = await db.matchDiary.create({
        data: createData,
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
            createdAt: {
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
            createdAt: {
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
            createdAt: {
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
    matches.forEach((match: MatchDiary) => {
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
    matches.forEach((match: MatchDiary) => {
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
export async function getMatch(userid: number): Promise<MatchDiaryWithPlayers[]> {
    const datas = await db.matchDiary.findMany({
        where: {
            userid: userid,
        },
        orderBy: {
            startTime: "desc",
        },
    });

    if (datas.length === 0) {
        return [];
    }

    // 모든 경기에 포함된 모든 선수 ID를 중복 없이 수집합니다.
    const playerIds = new Set<number>();
    datas.forEach((data: MatchDiary) => {
        data.players.forEach((id: number) => playerIds.add(id));
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
    const playersMap = new Map(playersData.map((p: PlayerDiary) => [p.id, p]));

    // 메모리에서 데이터를 조합하여 최종 결과를 만듭니다.
    return datas.map((data: MatchDiary) => ({
        ...data,
        players: data.players
            .map((id: number) => playersMap.get(id)) // playersMap.get(id)는 PlayerDiary | undefined를 반환할 수 있습니다.
            .filter((player: PlayerDiary | undefined): player is PlayerDiary => player !== undefined), // undefined를 제거하고 PlayerDiary[] 타입으로 명시
        winner1: data.winner1id ? (playersMap.get(data.winner1id) ?? null) : null,
        winner2: data.winner2id ? (playersMap.get(data.winner2id) ?? null) : null,
    }));
}
