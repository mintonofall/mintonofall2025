import { getUser, getClub } from "@/lib/getUserGoHome";
import db from "@/lib/db";
import Link from "next/link";

export default async function MyBettingPage({ params }: { params: Promise<{ id: string; date: string }> }) {
    const { id, date } = await params;
    const clubId = Number(id);
    const user = await getUser();
    const club = await getClub(clubId);
    const players = club?.players || [];

    // 로그인이 안 되어 있는 경우
    if (!user) {
        return (
            <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">{date} 나의 베팅 내역</h1>
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                    로그인이 필요한 페이지입니다.
                </div>
                <div className="mt-8 w-full max-w-2xl flex justify-center">
                    <Link
                        href={`/home/${clubId}/gameReview/${date}`}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                    >
                        돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // 1. 해당 날짜에 해당하는 클럽의 경기들을 조회합니다.
    const dayStart = new Date(`${date}T00:00:00+09:00`);
    const dayEnd = new Date(`${date}T23:59:59.999+09:00`);

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
            player1id: true,
            player2id: true,
            player3id: true,
            player4id: true,
            winner1id: true,
            winner2id: true,
        },
    });

    const matchIds = matchesOnDate.map((m) => m.id);

    // 2. 로그인된 유저의 해당 경기 베팅 내역을 최신순으로 가져옵니다.
    const bets = await db.betting.findMany({
        where: {
            userid: user.id,
            gameid: {
                in: matchIds,
            },
        },
        orderBy: {
            id: "desc",
        },
    });

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl mb-8 gap-4">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-blue-600">{date} 나의 베팅 내역</h1>
                    <p className="text-sm text-gray-600 font-semibold">
                        현재 보유 포인트: <span className="text-blue-500">{user.point?.toLocaleString() || 0} P</span>
                    </p>
                </div>
                <Link
                    href={`/home/${clubId}/gameReview/${date}`}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                    돌아가기
                </Link>
            </div>

            <div className="w-full max-w-3xl bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {bets.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {bets.map((bet) => {
                            let statusText = "진행중";
                            let statusColor = "text-gray-500";
                            let netWinnings = 0;

                            const betWinnerIds = Array.isArray(bet.betWinner) ? (bet.betWinner as number[]) : [];

                            // 베팅 결과 처리 상태 확인
                            if (bet.isProcess) {
                                if (bet.isHit === "noDecision") {
                                    statusText = "무효/취소 (환불)";
                                    netWinnings = 0;
                                } else if (bet.isCorrect) {
                                    statusText = "적중";
                                    statusColor = "text-red-500";
                                    netWinnings = betWinnerIds.length === 1 ? bet.betCoast * 2 : bet.betCoast * 3;
                                } else {
                                    statusText = "미적중";
                                    statusColor = "text-blue-500";
                                    netWinnings = -bet.betCoast;
                                }
                            }

                            const match = matchesOnDate.find((m) => m.id === bet.gameid);

                            return (
                                <li
                                    key={bet.id}
                                    className="py-4 flex flex-col justify-between gap-4 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full">
                                        <div className="flex-grow text-center sm:text-left">
                                            <p className="text-lg font-semibold text-gray-800">경기 ID: {bet.gameid}</p>
                                            <p className="text-sm text-gray-500">
                                                베팅 포인트: {bet.betCoast.toLocaleString()} P
                                            </p>
                                        </div>
                                        <div className="text-center sm:text-right flex-shrink-0 flex flex-col sm:items-end w-full sm:w-auto mt-2 sm:mt-0">
                                            <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
                                            {bet.isProcess && bet.isHit !== "noDecision" && (
                                                <p
                                                    className={`text-lg font-bold ${
                                                        netWinnings > 0
                                                            ? "text-red-500"
                                                            : netWinnings < 0
                                                              ? "text-blue-500"
                                                              : "text-gray-700"
                                                    }`}
                                                >
                                                    {netWinnings > 0 ? "+" : ""}
                                                    {netWinnings.toLocaleString()} P
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {match && (
                                        <div className="grid grid-cols-4 gap-2 text-center w-full mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            {[match.player1id, match.player2id, match.player3id, match.player4id].map(
                                                (pid, idx) => {
                                                    const player = players.find((pl: any) => pl.id === pid);
                                                    if (!player) {
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="bg-white border border-gray-200 p-1 rounded shadow-sm flex items-center justify-center text-gray-300 h-full min-h-[60px]"
                                                            >
                                                                -
                                                            </div>
                                                        );
                                                    }

                                                    const isSelected = betWinnerIds.includes(player.id);
                                                    const isWinner =
                                                        bet.isProcess &&
                                                        (match.winner1id === player.id ||
                                                            match.winner2id === player.id) &&
                                                        player.id !== null &&
                                                        player.id !== undefined;
                                                    const avatarSrc = player.avater?.startsWith(
                                                        "https://imagedelivery.net/",
                                                    )
                                                        ? `${player.avater}/avatar`
                                                        : player.avater;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`relative border p-1 rounded shadow-sm flex flex-col items-center justify-center gap-1 h-full min-h-[60px] ${isSelected ? "bg-yellow-100 border-yellow-500" : "bg-white border-gray-200"}`}
                                                        >
                                                            {isWinner && (
                                                                <span className="absolute -top-2 -left-1 bg-yellow-400 text-yellow-800 text-[10px] px-1 py-0.5 rounded shadow font-bold z-10">
                                                                    WIN
                                                                </span>
                                                            )}
                                                            {avatarSrc ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={avatarSrc}
                                                                    alt={player.name}
                                                                    className="w-10 h-10 rounded-full object-cover bg-gray-100 shadow-sm"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 shadow-sm">
                                                                    No Img
                                                                </div>
                                                            )}
                                                            <span className="text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                                                                {player.name}
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 py-8">해당 날짜에 베팅한 내역이 없습니다.</div>
                )}
            </div>
        </div>
    );
}
