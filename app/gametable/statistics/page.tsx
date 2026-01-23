import db from "@/lib/db";
import StatisticsClient from "./StatisticsClient";

export default async function Statistics() {
    // 한국 시간(KST) 기준 오늘 날짜 범위 계산
    const now = new Date();
    const utc = now.getTime();
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const kstTimestamp = utc + KST_OFFSET;
    const kstDate = new Date(kstTimestamp);

    kstDate.setUTCHours(0, 0, 0, 0);
    const startOfToday = new Date(kstDate.getTime() - KST_OFFSET);

    kstDate.setUTCHours(23, 59, 59, 999);
    const endOfToday = new Date(kstDate.getTime() - KST_OFFSET);

    // 오늘 진행된 게임 가져오기
    const todayGames = await db.dogGames.findMany({
        where: {
            createdAt: {
                gte: startOfToday,
                lte: endOfToday,
            },
        },
        select: {
            Players: true,
        },
    });

    // 플레이어별 게임 수 계산
    const gameCounts: Record<number, number> = {};
    todayGames.forEach((game) => {
        game.Players.forEach((playerId) => {
            gameCounts[playerId] = (gameCounts[playerId] || 0) + 1;
        });
    });

    // 모든 플레이어 정보 가져오기
    const allPlayers = await db.dogPlayer.findMany();

    // 2인 (Duo) statistics
    const duoCounts: Record<string, number> = {};
    const trioCounts: Record<string, number> = {};
    const quartetCounts: Record<string, number> = {};

    todayGames.forEach((game) => {
        if (game.Players.length >= 4) {
            // 참여한 모든 플레이어 정렬
            const p = [...game.Players].sort((a, b) => a - b);

            // 2인 (Duo) - 4명 중 2명을 뽑는 조합
            const combos2 = [
                [p[0], p[1]],
                [p[0], p[2]],
                [p[0], p[3]],
                [p[1], p[2]],
                [p[1], p[3]],
                [p[2], p[3]],
            ];
            combos2.forEach((c) => {
                const key2 = c.join(",");
                duoCounts[key2] = (duoCounts[key2] || 0) + 1;
            });

            // 4인 (Quartet)
            const key4 = p.join(",");
            quartetCounts[key4] = (quartetCounts[key4] || 0) + 1;

            // 3인 (Trio) - 4명 중 3명을 뽑는 조합
            const combos3 = [
                [p[0], p[1], p[2]],
                [p[0], p[1], p[3]],
                [p[0], p[2], p[3]],
                [p[1], p[2], p[3]],
            ];
            combos3.forEach((c) => {
                const key3 = c.join(",");
                trioCounts[key3] = (trioCounts[key3] || 0) + 1;
            });
        }
    });

    // 게임 수 정보를 포함하여 정렬 (오늘 게임 수 내림차순)
    const playersWithStats = allPlayers
        .map((player) => ({
            ...player,
            todayGameNum: gameCounts[player.id] || 0,
        }))
        .sort((a, b) => b.todayGameNum - a.todayGameNum);

    const playerMap = new Map(allPlayers.map((p) => [p.id, p]));

    const duoStats = Object.entries(duoCounts)
        .map(([key, count]) => {
            const [p1Id, p2Id] = key.split(",").map(Number);
            return {
                player1: playerMap.get(p1Id),
                player2: playerMap.get(p2Id),
                count,
            };
        })
        .filter((item) => item.player1 && item.player2)
        .sort((a, b) => b.count - a.count);

    const trioStats = Object.entries(trioCounts)
        .map(([key, count]) => {
            const [p1Id, p2Id, p3Id] = key.split(",").map(Number);
            return {
                player1: playerMap.get(p1Id),
                player2: playerMap.get(p2Id),
                player3: playerMap.get(p3Id),
                count,
            };
        })
        .filter((item) => item.player1 && item.player2 && item.player3)
        .sort((a, b) => b.count - a.count);

    const quartetStats = Object.entries(quartetCounts)
        .map(([key, count]) => {
            const [p1Id, p2Id, p3Id, p4Id] = key.split(",").map(Number);
            return {
                player1: playerMap.get(p1Id),
                player2: playerMap.get(p2Id),
                player3: playerMap.get(p3Id),
                player4: playerMap.get(p4Id),
                count,
            };
        })
        .filter((item) => item.player1 && item.player2 && item.player3 && item.player4)
        .sort((a, b) => b.count - a.count);

    return (
        <StatisticsClient
            players={playersWithStats}
            duoStats={duoStats}
            trioStats={trioStats}
            quartetStats={quartetStats}
        />
    );
}
