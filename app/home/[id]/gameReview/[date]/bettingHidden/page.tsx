import db from "@/lib/db";
import Link from "next/link";
import { getClub } from "@/lib/getUserGoHome";

export default async function BettingHiddenPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string; date: string }>;
    searchParams: Promise<{ selectedUser?: string }>;
}) {
    const { id, date } = await params;
    const sp = await searchParams;
    const clubId = Number(id);
    const selectedUserId = sp.selectedUser === "all" ? "all" : sp.selectedUser ? Number(sp.selectedUser) : null;

    // 1. 해당 날짜 시작/종료 시간 계산
    const dayStart = new Date(`${date}T00:00:00+09:00`);
    const dayEnd = new Date(`${date}T23:59:59.999+09:00`);

    // 2. 해당 날짜에 해당하는 클럽의 경기들을 조회
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

    // 3. 해당 경기들에 대한 모든 베팅 내역 조회
    const bets = await db.betting.findMany({
        where: {
            gameid: {
                in: matchIds,
            },
        },
    });

    // 선수 정보 조회 (베팅 상세 내역 표시에 필요)
    const club = await getClub(clubId);
    const players = club?.players || [];

    // 4. 베팅한 유저들의 ID 추출 및 유저 정보 조회
    const userIds = Array.from(new Set(bets.map((bet) => bet.userid)));
    const users = await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, userName: true, point: true },
    });
    const userMap = new Map(users.map((u) => [u.id, { name: u.userName, point: u.point || 0 }]));

    // 5. 유저별 통계 데이터 계산
    const userStats = userIds.map((userId) => {
        const userBets = bets.filter((b) => b.userid === userId);
        let totalBet = 0;
        let totalReturn = 0;

        userBets.forEach((bet) => {
            totalBet += bet.betCoast;

            // 베팅 결과 처리가 완료된 경우
            if (bet.isProcess) {
                if (bet.isHit === "noDecision") {
                    totalReturn += bet.betCoast; // 무효/취소일 경우 원금 반환
                } else if (bet.isCorrect) {
                    const betWinnerIds = Array.isArray(bet.betWinner) ? (bet.betWinner as number[]) : [];
                    const multiplier = betWinnerIds.length === 1 ? 2 : 3;
                    totalReturn += bet.betCoast * multiplier;
                }
            }
        });

        const netProfit = totalReturn - totalBet;
        const userInfo = userMap.get(userId) || { name: `User ${userId}`, point: 0 };

        return {
            userId,
            userName: userInfo.name,
            currentPoint: userInfo.point,
            betCount: userBets.length,
            totalBet,
            totalReturn,
            netProfit,
        };
    });

    // 6. 순수익이 높은 순으로 내림차순 정렬
    userStats.sort((a, b) => b.netProfit - a.netProfit);

    const selectedUserBets =
        selectedUserId === "all" ? bets : selectedUserId ? bets.filter((b) => b.userid === selectedUserId) : [];
    const selectedUserName =
        selectedUserId === "all"
            ? "전체 유저"
            : selectedUserId
              ? userMap.get(selectedUserId as number)?.name || `User ${selectedUserId}`
              : "";

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mb-8 gap-4">
                <h1 className="text-3xl font-bold text-blue-600">{date} 베팅 유저 목록</h1>
                <div className="flex gap-2">
                    <Link
                        href={`?selectedUser=all#detail`}
                        scroll={false}
                        className="px-4 py-2 bg-gray-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-gray-600 transition-colors"
                    >
                        전체보기
                    </Link>
                    <Link
                        href={`/home/${clubId}/gameReview/${date}`}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                    >
                        돌아가기
                    </Link>
                </div>
            </div>

            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                {userStats.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    순위
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    유저명
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    현재 포인트
                                </th>
                                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    베팅 횟수
                                </th>
                                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    총 베팅액
                                </th>
                                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    총 당첨액
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    순수익
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userStats.map((stat, index) => (
                                <tr key={stat.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                        <Link
                                            href={`?selectedUser=${stat.userId}#detail`}
                                            className="text-blue-600 hover:underline"
                                            scroll={false}
                                        >
                                            {stat.userName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-700">
                                        {stat.currentPoint.toLocaleString()} P
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                        {stat.betCount}회
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                        {stat.totalBet.toLocaleString()} P
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                        {stat.totalReturn.toLocaleString()} P
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${stat.netProfit > 0 ? "text-red-500" : stat.netProfit < 0 ? "text-blue-500" : "text-gray-500"}`}
                                    >
                                        {stat.netProfit > 0 ? "+" : ""}
                                        {stat.netProfit.toLocaleString()} P
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-500 py-8">이날 베팅한 유저가 없습니다.</div>
                )}
            </div>

            {/* 선택된 유저 베팅 상세 내역 */}
            {selectedUserId && (
                <div id="detail" className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedUserName} 베팅 상세 내역</h2>
                    {selectedUserBets.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {selectedUserBets.map((bet) => {
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
                                        className="py-4 flex flex-col gap-4 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full">
                                            <div className="flex-grow text-center sm:text-left">
                                                <p className="text-lg font-semibold text-gray-800">
                                                    경기 ID: {bet.gameid}
                                                </p>
                                                {selectedUserId === "all" && (
                                                    <p className="text-sm font-bold text-blue-600 mb-1">
                                                        베팅 유저:{" "}
                                                        {userMap.get(bet.userid)?.name || `User ${bet.userid}`}
                                                    </p>
                                                )}
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
                                                {[
                                                    match.player1id,
                                                    match.player2id,
                                                    match.player3id,
                                                    match.player4id,
                                                ].map((pid, idx) => {
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
                                                        player.id !== null;
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
                                                })}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-gray-500 text-center py-8">베팅 내역이 없습니다.</div>
                    )}
                </div>
            )}
        </div>
    );
}
