import db from "@/lib/db";
import Link from "next/link";

// Helper function to format numbers with commas
const formatNumber = (num: number) => {
    return num.toLocaleString();
};

export default async function BettingKingPage({ params }: { params: Promise<{ id: string; date: string }> }) {
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
        },
    });

    if (matchesOnDate.length === 0) {
        return (
            <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-orange-600">{date} 베팅왕 👑</h1>
                    <Link
                        href={`/home/${clubId}/gameReview/${date}`}
                        className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-orange-600 transition-colors"
                    >
                        돌아가기
                    </Link>
                </div>
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                    해당 날짜에 종료된 경기가 없어 베팅 기록을 집계할 수 없습니다.
                </div>
            </div>
        );
    }

    const matchIds = matchesOnDate.map((m) => m.id);

    // 3. 해당 경기에 대한 처리된(isProcess: true) 베팅 내역을 가져옵니다.
    const bets = await db.betting.findMany({
        where: {
            gameid: {
                in: matchIds,
            },
            isProcess: true,
        },
        include: {
            User: {
                select: {
                    id: true,
                    userName: true,
                    point: true,
                },
            },
        },
    });

    // 4. 사용자별 순수익을 계산합니다.
    const userWinnings = new Map<
        number,
        { user: any; totalNetWinnings: number; totalBets: number; correctBets: number }
    >();

    for (const bet of bets) {
        if (!bet.User || !bet.userid) continue;

        let netWinnings = 0;
        if (bet.isHit === "noDecision") {
            netWinnings = 0; // 무승부/취소 시 베팅금 환불 (순수익 0)
        } else if (bet.isCorrect) {
            if (bet.betWinner.length === 1) {
                netWinnings = bet.betCoast; // 2배 지급이므로 순수익은 1배
            } else if (bet.betWinner.length === 2) {
                netWinnings = bet.betCoast * 2; // 3배 지급이므로 순수익은 2배
            }
        } else {
            netWinnings = -bet.betCoast; // 미적중 시 베팅금 손실
        }

        if (!userWinnings.has(bet.userid)) {
            userWinnings.set(bet.userid, {
                user: bet.User,
                totalNetWinnings: 0,
                totalBets: 0,
                correctBets: 0,
            });
        }

        const userData = userWinnings.get(bet.userid)!;
        userData.totalNetWinnings += netWinnings;
        userData.totalBets += 1;
        if (bet.isCorrect) {
            userData.correctBets += 1;
        }
    }

    // 5. 순수익 기준으로 내림차순 정렬합니다.
    const rankedUsers = Array.from(userWinnings.values()).sort((a, b) => b.totalNetWinnings - a.totalNetWinnings);

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl mb-8 gap-4">
                <h1 className="text-3xl font-bold text-orange-600">{date} 베팅왕 👑</h1>
                <Link
                    href={`/home/${clubId}/gameReview/${date}`}
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-orange-600 transition-colors"
                >
                    돌아가기
                </Link>
            </div>

            <div className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {rankedUsers.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {rankedUsers.map((entry, index) => {
                            const rank = index + 1;
                            const hitRate = entry.totalBets > 0 ? (entry.correctBets / entry.totalBets) * 100 : 0;

                            return (
                                <li key={entry.user.id} className="py-4 flex items-center gap-4">
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
                                    <div className="flex-grow">
                                        <p className="text-lg font-semibold text-gray-800">{entry.user.userName}</p>
                                        <p className="text-sm text-gray-500">
                                            적중률: {hitRate.toFixed(1)}% ({entry.correctBets}/{entry.totalBets})
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0 flex flex-col items-end">
                                        <p
                                            className={`text-xl font-bold ${
                                                entry.totalNetWinnings > 0
                                                    ? "text-red-500"
                                                    : entry.totalNetWinnings < 0
                                                      ? "text-blue-500"
                                                      : "text-gray-700"
                                            }`}
                                        >
                                            {entry.totalNetWinnings > 0 ? "+" : ""}
                                            {formatNumber(entry.totalNetWinnings)} P
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">
                                            보유: {formatNumber(entry.user.point || 0)} P
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 py-8">처리된 베팅 기록이 없습니다.</div>
                )}
            </div>
        </div>
    );
}
