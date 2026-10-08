import db from "@/lib/db";
import Link from "next/link";
import { getClub } from "@/lib/getUserGoHome";

export default async function ManyOpponentsPage({ params }: { params: Promise<{ id: string; date: string }> }) {
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
            player1id: true,
            player2id: true,
            player3id: true,
            player4id: true,
            winner1id: true,
            winner2id: true,
        },
    });

    const club = await getClub(clubId);
    const players = club?.players || [];

    // 3. 선수별로 함께 경기한 서로 다른 선수(고유 인원)와 전적(승/패)을 집계합니다. 같은편/상대 구분 없이 한 경기에 같이 뛴 3명을 모두 포함합니다.
    const opponentSets = new Map<number, Set<number>>();
    const records = new Map<number, { games: number; wins: number; losses: number }>();

    matchesOnDate.forEach((match) => {
        const matchPlayers = [match.player1id, match.player2id, match.player3id, match.player4id].filter(
            (pid): pid is number => !!pid,
        );
        matchPlayers.forEach((pid) => {
            if (!opponentSets.has(pid)) {
                opponentSets.set(pid, new Set());
            }
            const set = opponentSets.get(pid)!;
            matchPlayers.forEach((otherId) => {
                if (otherId !== pid) set.add(otherId);
            });

            if (!records.has(pid)) {
                records.set(pid, { games: 0, wins: 0, losses: 0 });
            }
            const record = records.get(pid)!;
            record.games += 1;
            if (match.winner1id === pid || match.winner2id === pid) {
                record.wins += 1;
            } else if (match.winner1id != null) {
                record.losses += 1;
            }
        });
    });

    // 4. 함께한 고유 인원 수 기준으로 내림차순 정렬합니다.
    const rankedPlayers = Array.from(opponentSets.entries())
        .map(([pid, set]) => {
            const player = players.find((p: any) => p.id === pid);
            const record = records.get(pid) || { games: 0, wins: 0, losses: 0 };
            return { player, count: set.size, record };
        })
        .filter((entry) => entry.player) // 선수 정보가 있는 경우만 렌더링
        .sort((a, b) => b.count - a.count);

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl mb-8 gap-4">
                <h1 className="text-3xl font-bold text-blue-600">{date} 폭넓은 교류 순위 🏸</h1>
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
                                <li key={entry.player!.id}>
                                    <Link
                                        href={`/home/${clubId}/gameReview/${date}/matchResults?player=${entry.player!.id}&from=manyOpponents`}
                                        className="py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors -mx-2 px-2 rounded"
                                    >
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
                                            <p className="text-lg font-semibold text-gray-800">
                                                {entry.player!.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {entry.record.games}전 {entry.record.wins}승 {entry.record.losses}패
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xl font-bold text-blue-600">{entry.count}명</p>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 py-8">해당 날짜에 진행된 경기가 없습니다.</div>
                )}
            </div>
        </div>
    );
}
