"use server";

import db from "@/lib/db";

export async function getAllUsers() {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                userName: true,
                point: true,
                createdAt: true,
            },
            orderBy: { id: "desc" }, // 최신순으로 정렬
        });
        return users;
    } catch (error) {
        console.error("유저 데이터를 가져오는 중 오류 발생:", error);
        return [];
    }
}

export async function getAllClubs() {
    try {
        const clubs = await db.club.findMany({
            include: {
                _count: {
                    select: {
                        players: true,
                    },
                },
            },
            orderBy: { id: "desc" }, // 최신순으로 정렬
        });

        // 매치 DB에서 각 클럽의 id를 기준으로 매치 수를 카운트하여 matchCount에 추가
        const clubsWithMatchCount = await Promise.all(
            clubs.map(async (club) => {
                const matchCount = await db.match.count({
                    where: { clubid: club.id },
                });
                return {
                    ...club,
                    _count: { ...club._count, matchCount },
                };
            }),
        );

        // 터미널에서 실제 DB에서 가져온 값을 확인하기 위한 로그
        console.log("🔥 조회된 클럽 데이터 확인:", JSON.stringify(clubsWithMatchCount, null, 2));

        return clubsWithMatchCount;
    } catch (error) {
        console.error("클럽 데이터를 가져오는 중 오류 발생:", error);
        return [];
    }
}

export async function getPlayers(clubId?: number) {
    try {
        const whereClause = clubId ? { clubid: clubId } : {};
        const players = await db.player.findMany({
            where: whereClause,
            orderBy: { id: "desc" }, // 최신순으로 정렬
        });

        // 💡 타입(문자열/숫자) 불일치로 인한 Prisma 조회 오류를 막기 위해 숫자로 안전하게 변환
        const clubIds = Array.from(new Set(players.map((p) => Number(p.clubid)).filter((id) => !isNaN(id) && id > 0)));

        const clubs = await db.club.findMany({
            where: { id: { in: clubIds } },
        });

        // 💡 Map의 키를 문자열로 통일하여 p.clubid가 숫자이든 문자열이든 완벽하게 일치하도록 수정
        const clubMap = new Map(clubs.map((c) => [String(c.id), c]));

        return players.map((p) => ({
            ...p,
            club: p.clubid ? clubMap.get(String(p.clubid)) : null,
        }));
    } catch (error) {
        console.error("플레이어 데이터를 가져오는 중 오류 발생:", error);
        return [];
    }
}

export async function getMatches(clubId?: number) {
    try {
        const whereClause = clubId ? { clubid: clubId } : {};
        const matches = await db.match.findMany({
            where: whereClause,
            orderBy: { id: "desc" },
            take: 100, // 최신 100개
        });

        const clubIds = Array.from(new Set(matches.map((m) => Number(m.clubid)).filter((id) => !isNaN(id) && id > 0)));
        const clubs = await db.club.findMany({ where: { id: { in: clubIds } } });
        const clubMap = new Map(clubs.map((c) => [String(c.id), c]));

        const playerIds = new Set<number>();
        matches.forEach((m) => {
            if (m.player1id) playerIds.add(m.player1id);
            if (m.player2id) playerIds.add(m.player2id);
            if (m.player3id) playerIds.add(m.player3id);
            if (m.player4id) playerIds.add(m.player4id);
        });

        const players = await db.player.findMany({ where: { id: { in: Array.from(playerIds) } } });
        const playerMap = new Map(players.map((p) => [p.id, p]));

        return matches.map((m) => ({
            ...m,
            club: m.clubid ? clubMap.get(String(m.clubid)) : null,
            player1: m.player1id ? playerMap.get(m.player1id) : null,
            player2: m.player2id ? playerMap.get(m.player2id) : null,
            player3: m.player3id ? playerMap.get(m.player3id) : null,
            player4: m.player4id ? playerMap.get(m.player4id) : null,
        }));
    } catch (error) {
        console.error("매치 데이터를 가져오는 중 오류 발생:", error);
        return [];
    }
}

export async function getBettings() {
    try {
        const bettings = await db.betting.findMany({
            orderBy: { id: "desc" },
            take: 100,
        });

        const userIds = Array.from(new Set(bettings.map((b) => b.userid).filter(Boolean)));
        const users = await db.user.findMany({ where: { id: { in: userIds } } });
        const userMap = new Map(users.map((u) => [u.id, u]));

        // 매치(Game) 데이터 안전하게 추출 (문자열 UUID/CUID 타입 및 숫자 타입 모두 대응)
        const rawGameIds = Array.from(new Set(bettings.map((b) => b.gameid).filter(Boolean)));
        let matches: any[] = [];

        if (rawGameIds.length > 0) {
            try {
                matches = await db.match.findMany({ where: { id: { in: rawGameIds.map(String) as any } } });
            } catch (error) {
                const numericIds = rawGameIds.map(Number).filter((id) => !isNaN(id));
                if (numericIds.length > 0) {
                    matches = await db.match.findMany({ where: { id: { in: numericIds as any } } });
                }
            }
        }
        const matchMap = new Map(matches.map((m) => [String(m.id), m]));

        // 베팅된 플레이어 ID 및 매치 참여 플레이어 ID 추출
        const playerIds = new Set<number>();
        bettings.forEach((b) => {
            if (Array.isArray(b.betWinner)) {
                b.betWinner.forEach((pid) => {
                    if (typeof pid === "number") playerIds.add(pid);
                });
            }
        });

        matches.forEach((m) => {
            if (m.player1id) playerIds.add(m.player1id);
            if (m.player2id) playerIds.add(m.player2id);
            if (m.player3id) playerIds.add(m.player3id);
            if (m.player4id) playerIds.add(m.player4id);
        });

        const players = await db.player.findMany({ where: { id: { in: Array.from(playerIds) } } });
        const playerMap = new Map(players.map((p) => [p.id, p]));

        return bettings.map((b) => {
            const match = b.gameid ? matchMap.get(String(b.gameid)) : null;
            return {
                ...b,
                user: b.userid ? userMap.get(b.userid) : null,
                betWinnerPlayers: Array.isArray(b.betWinner)
                    ? b.betWinner.map((pid) => playerMap.get(pid as number)).filter(Boolean)
                    : [],
                matchDetails: match
                    ? {
                          ...match,
                          player1: match.player1id ? playerMap.get(match.player1id) : null,
                          player2: match.player2id ? playerMap.get(match.player2id) : null,
                          player3: match.player3id ? playerMap.get(match.player3id) : null,
                          player4: match.player4id ? playerMap.get(match.player4id) : null,
                      }
                    : null,
            };
        });
    } catch (error) {
        console.error("베팅 데이터를 가져오는 중 오류 발생:", error);
        return [];
    }
}
