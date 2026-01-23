import db from "@/lib/db";
import SearchInput from "./SearchInput";
import DeleteGameButton from "./DeleteGameButton";

export default async function GameResult({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const { search } = await searchParams;
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

    const where: {
        createdAt?: {
            gte?: Date;
            lte?: Date;
        };
        Players?: {
            hasSome?: number[];
        };
        id?: number;
    } = {
        createdAt: {
            gte: startOfToday,
            lte: endOfToday,
        },
    };

    if (search) {
        const players = await db.dogPlayer.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
            select: { id: true },
        });
        const playerIds = players.map((p) => p.id);

        if (playerIds.length > 0) {
            where.Players = {
                hasSome: playerIds,
            };
        } else {
            // 검색된 선수가 없으면 결과도 없음 (불가능한 ID로 설정)
            where.id = -1;
        }
    }

    // 게임 목록 가져오기 (최신순, 오늘 날짜만)
    const games = await db.dogGames.findMany({
        where,
        orderBy: {
            id: "desc",
        },
    });

    // 모든 게임의 플레이어 ID 수집 (중복 제거)
    const allPlayerIds = Array.from(new Set(games.flatMap((game) => game.Players)));

    // 플레이어 정보 가져오기
    const players = await db.dogPlayer.findMany({
        where: {
            id: {
                in: allPlayerIds,
            },
        },
    });

    // ID로 플레이어 정보를 빠르게 조회할 수 있도록 Map 생성
    const playerMap = new Map(players.map((p) => [p.id, p]));

    return (
        <div className="w-full p-4 bg-gray-50 min-h-[90vh]">
            <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">Game Results</h1>
            <SearchInput />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                    <div key={game.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-gray-500">Game #{game.id}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">
                                    {game.createdAt &&
                                        new Date(game.createdAt).toLocaleTimeString("ko-KR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            timeZone: "Asia/Seoul",
                                        })}
                                </span>
                                <DeleteGameButton gameId={game.id} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {game.Players.map((playerId) => {
                                const player = playerMap.get(playerId);
                                return (
                                    <div
                                        key={playerId}
                                        className={`text-center p-2 rounded-lg ${
                                            player?.gender === "man"
                                                ? "bg-blue-500"
                                                : player?.gender === "woman"
                                                  ? "bg-red-100"
                                                  : "bg-gray-50"
                                        }`}
                                    >
                                        <span
                                            className={`font-semibold ${player?.gender === "man" ? "text-white" : "text-gray-800"}`}
                                        >
                                            {player?.name || "Unknown"}
                                        </span>
                                        <span
                                            className={`text-xs ml-1 ${player?.gender === "man" ? "text-blue-200" : "text-gray-500"}`}
                                        >
                                            {player?.grade}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
