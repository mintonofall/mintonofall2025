import db from "@/lib/db";
import Link from "next/link";
import { getClub } from "@/lib/getUserGoHome";

export default async function ManyPickPage({ params }: { params: Promise<{ id: string; date: string }> }) {
    const { id, date } = await params;
    const clubId = Number(id);

    // 1. KST 기준으로 해당 날짜의 시작과 끝을 설정합니다.
    const dayStart = new Date(`${date}T00:00:00+09:00`);
    const dayEnd = new Date(`${date}T23:59:59.999+09:00`);

    // 2. 해당 날짜에 종료된 경기를 찾습니다.
    const matchesOnDate = await db.match.findMany({
        where: {
            clubid: clubId,
            endTime: {
                gte: dayStart,
                lt: dayEnd,
            },
        },
        select: {
            id: true,
            winner1id: true,
            winner2id: true,
            player1id: true,
            player2id: true,
            player3id: true,
            player4id: true,
        },
    });

    const matchIds = matchesOnDate.map((m) => m.id);

    // 3. 해당 경기들의 베팅 내역을 가져옵니다.
    const bets = await db.betting.findMany({
        where: { gameid: { in: matchIds } },
        select: { betWinner: true },
    });

    const club = await getClub(clubId);
    const players = club?.players || [];

    // 4. 선수별 픽(Pick) 수와 승률을 계산합니다.
    const pickCounts = new Map<number, number>();
    const winCounts = new Map<number, number>();
    const gameCounts = new Map<number, number>();

    matchesOnDate.forEach((match) => {
        if (match.winner1id) winCounts.set(match.winner1id, (winCounts.get(match.winner1id) || 0) + 1);
        if (match.winner2id) winCounts.set(match.winner2id, (winCounts.get(match.winner2id) || 0) + 1);

        const matchPlayers = [match.player1id, match.player2id, match.player3id, match.player4id];
        matchPlayers.forEach((pid) => {
            if (pid) gameCounts.set(pid, (gameCounts.get(pid) || 0) + 1);
        });
    });

    bets.forEach((bet) => {
        const betWinners = Array.isArray(bet.betWinner) ? (bet.betWinner as number[]) : [];
        betWinners.forEach((pid) => {
            if (pid) pickCounts.set(pid, (pickCounts.get(pid) || 0) + 1);
        });
    });

    // 5. 픽 수 기준으로 내림차순 정렬하고 상위 5명만 자릅니다. (픽 수가 같을 경우 승률순)
    const rankedPlayers = Array.from(pickCounts.entries())
        .map(([pid, count]) => {
            const player = players.find((p: any) => p.id === pid);
            const totalGames = gameCounts.get(pid) || 0;
            const wins = winCounts.get(pid) || 0;
            const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
            return { player, count, winRate };
        })
        .filter((entry) => entry.player)
        .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return b.winRate - a.winRate; // 동률일 경우 승률이 높은 순
        })
        .slice(0, 5); // 상위 5명

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl mb-8 gap-4">
                <h1 className="text-3xl font-bold text-blue-600">{date} 픽 순위 (Top 5) 🎯</h1>
                <Link
                    href={`/home/${clubId}/gameReview/${date}`}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                    돌아가기
                </Link>
            </div>

            <div className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {rankedPlayers.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {rankedPlayers.map((entry, index) => {
                            const rank = index + 1;
                            const avatarSrc = entry.player!.avater?.startsWith("https://imagedelivery.net/")
                                ? `${entry.player!.avater}/avatar`
                                : entry.player!.avater;

                            return (
                                <li key={entry.player!.id} className="py-4 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 text-center">
                                        {rank === 1 ? (
                                            <span className="text-2xl">🥇</span>
                                        ) : rank === 2 ? (
                                            <span className="text-2xl">🥈</span>
                                        ) : rank === 3 ? (
                                            <span className="text-2xl">🥉</span>
                                        ) : (
                                            <span className="text-lg font-bold text-gray-500">{rank}</span>
                                        )}
                                    </div>
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm flex items-center justify-center border">
                                        {avatarSrc ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={avatarSrc}
                                                alt={entry.player!.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] text-gray-400">No Img</span>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-lg font-semibold text-gray-800">{entry.player!.name}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 flex flex-col items-end">
                                        <p className="text-xl font-bold text-orange-500">{entry.count} 픽</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 py-8">해당 날짜에 베팅된 기록이 없습니다.</div>
                )}
            </div>
        </div>
    );
}
