"use client";

import { useState, useEffect } from "react";
import { getAllUsers, getAllClubs, getPlayers, getMatches, getBettings } from "./actions";
import { getUser } from "@/lib/getUserGoHome";

type MenuType = "user" | "club" | "player" | "match" | "betting";

export default function DashBoard() {
    const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthorized">("loading");
    const [activeMenu, setActiveMenu] = useState<MenuType>("user");
    const [users, setUsers] = useState<any[]>([]);
    const [clubs, setClubs] = useState<any[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [bettings, setBettings] = useState<any[]>([]);
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await getUser();
            if (currentUser && currentUser.userName === "dogtable") {
                setAuthStatus("authenticated");
            } else {
                setAuthStatus("unauthorized");
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (authStatus === "authenticated") {
            if (activeMenu === "user") {
                setIsLoading(true);
                getAllUsers().then((data) => {
                    setUsers(data);
                    setIsLoading(false);
                });
            } else if (activeMenu === "club") {
                setIsLoading(true);
                getAllClubs().then((data) => {
                    setClubs(data);
                    setIsLoading(false);
                });
            } else if (activeMenu === "player") {
                setIsLoading(true);
                getPlayers(selectedClubId ?? undefined).then((data) => {
                    setPlayers(data);
                    setIsLoading(false);
                });
            } else if (activeMenu === "match") {
                setIsLoading(true);
                getMatches(selectedClubId ?? undefined).then((data) => {
                    setMatches(data);
                    setIsLoading(false);
                });
            } else if (activeMenu === "betting") {
                setIsLoading(true);
                getBettings().then((data) => {
                    setBettings(data);
                    setIsLoading(false);
                });
            }
        }
    }, [authStatus, activeMenu, selectedClubId]);

    if (authStatus === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-600">권한을 확인하는 중입니다...</p>
            </div>
        );
    }

    if (authStatus === "unauthorized") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md text-center">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">접근 거부</h1>
                    <p className="text-gray-700">이 페이지에 접근할 권한이 없습니다.</p>
                </div>
            </div>
        );
    }

    const menuItems: { id: MenuType; label: string }[] = [
        { id: "user", label: "유저 (User)" },
        { id: "club", label: "클럽 (Club)" },
        { id: "player", label: "플레이어 (Player)" },
        { id: "match", label: "매치 (Match)" },
        { id: "betting", label: "베팅 (Betting)" },
    ];

    const renderPlayerWithPhoto = (player: any) => {
        if (!player) return <div className="text-gray-400 w-12 text-center">-</div>;
        const avatarSrc = player.avater?.startsWith("https://imagedelivery.net/")
            ? `${player.avater}/avatar`
            : player.avater;
        return (
            <div className="flex flex-col items-center justify-center gap-1 w-14">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] text-gray-400">No</span>
                    )}
                </div>
                <span className="text-[11px] font-medium text-gray-700 w-full truncate text-center" title={player.name}>
                    {player.name}
                </span>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "user":
                return (
                    <div>
                        <p className="text-gray-500 mb-4">가입된 유저 목록과 보유 포인트를 표시할 수 있습니다.</p>
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500">데이터를 불러오는 중...</div>
                        ) : (
                            <div className="overflow-x-auto border rounded-lg shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                유저명
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                보유 포인트
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                생성일
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {user.userName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-bold">
                                                    {user.point?.toLocaleString() || 0} P
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                    {user.createdAt
                                                        ? new Date(user.createdAt).toLocaleDateString("ko-KR")
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">유저 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case "club":
                return (
                    <div>
                        <p className="text-gray-500 mb-4">생성된 클럽 목록과 설정된 코트 수 등을 표시할 수 있습니다.</p>
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500">데이터를 불러오는 중...</div>
                        ) : (
                            <div className="overflow-x-auto border rounded-lg shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                클럽명 (유저명)
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                코트 수
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                플레이어 수
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                매치 수
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                생성일
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {clubs.map((club) => (
                                            <tr key={club.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {club.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {club.name || club.clubName || club.userName || "이름 없음"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                    {club.howManyCourts || 0} 개
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClubId(club.id);
                                                            setActiveMenu("player");
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline font-bold transition-colors"
                                                    >
                                                        {club._count?.players || 0} 명
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClubId(club.id);
                                                            setActiveMenu("match");
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline font-bold transition-colors"
                                                    >
                                                        {club._count?.matchCount || 0} 건
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                    {club.createdAt
                                                        ? new Date(club.createdAt).toLocaleDateString("ko-KR")
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {clubs.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">클럽 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case "player":
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-500">
                                {selectedClubId
                                    ? `클럽 ID ${selectedClubId}에 등록된 플레이어 목록입니다.`
                                    : "전체 클럽의 플레이어(선수) 목록입니다."}
                            </p>
                            {selectedClubId && (
                                <button
                                    onClick={() => setSelectedClubId(null)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                                >
                                    전체 보기
                                </button>
                            )}
                        </div>
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500">데이터를 불러오는 중...</div>
                        ) : (
                            <div className="overflow-x-auto border rounded-lg shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                사진
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                소속 클럽
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                이름
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                성별
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                등급
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                생성일
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {players.map((player) => (
                                            <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {player.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mx-auto flex-shrink-0">
                                                        {player.avater ? (
                                                            <img
                                                                src={
                                                                    player.avater?.startsWith(
                                                                        "https://imagedelivery.net/",
                                                                    )
                                                                        ? `${player.avater}/avatar`
                                                                        : player.avater
                                                                }
                                                                alt={player.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                                No Img
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {player.club?.name ||
                                                        player.club?.clubName ||
                                                        player.club?.userName ||
                                                        `클럽 ID ${player.clubid}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {player.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                    {player.gender === "man" ? "남성" : "여성"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 font-bold">
                                                    {player.grade}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                    {player.createat
                                                        ? new Date(player.createat).toLocaleDateString("ko-KR")
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {players.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">플레이어 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case "match":
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-500">
                                {selectedClubId
                                    ? `클럽 ID ${selectedClubId}에 속한 게임(매치) 목록입니다.`
                                    : "전체 클럽의 게임(매치) 목록입니다."}
                            </p>
                            {selectedClubId && (
                                <button
                                    onClick={() => setSelectedClubId(null)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                                >
                                    전체 보기
                                </button>
                            )}
                        </div>
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500">데이터를 불러오는 중...</div>
                        ) : (
                            <div className="overflow-x-auto border rounded-lg shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                소속 클럽
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                팀 1 (Player 1, 2)
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                팀 2 (Player 3, 4)
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                우승 팀
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                생성일
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {matches.map((match) => {
                                            let winnerText = "-";
                                            if (
                                                match.winner1id &&
                                                (match.winner1id === match.player1id ||
                                                    match.winner1id === match.player2id)
                                            ) {
                                                winnerText = "팀 1 승리";
                                            } else if (
                                                match.winner1id &&
                                                (match.winner1id === match.player3id ||
                                                    match.winner1id === match.player4id)
                                            ) {
                                                winnerText = "팀 2 승리";
                                            }

                                            return (
                                                <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {match.id}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {match.club?.name ||
                                                            match.club?.clubName ||
                                                            match.club?.userName ||
                                                            `클럽 ID ${match.clubid}`}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex justify-center items-center gap-4">
                                                            {renderPlayerWithPhoto(match.player1)}
                                                            {renderPlayerWithPhoto(match.player2)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex justify-center items-center gap-4">
                                                            {renderPlayerWithPhoto(match.player3)}
                                                            {renderPlayerWithPhoto(match.player4)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">
                                                        {winnerText}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {match.createdAt || match.createat
                                                            ? new Date(
                                                                  match.createdAt || match.createat,
                                                              ).toLocaleDateString("ko-KR")
                                                            : "-"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {matches.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">매치 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case "betting":
                return (
                    <div>
                        <p className="text-gray-500 mb-4">유저들의 베팅 내역과 적중 결과 등을 표시할 수 있습니다.</p>
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500">데이터를 불러오는 중...</div>
                        ) : (
                            <div className="overflow-x-auto border rounded-lg shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                유저명
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                베팅 매치 ID
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                참가 선수 (팀 1 vs 팀 2)
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                경기 결과
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                선택 선수 (픽)
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                베팅 금액
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                상태 / 결과
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                생성일
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bettings.map((bet) => (
                                            <tr key={bet.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                    {bet.id}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                                                    {bet.user?.userName || `유저 ID ${bet.userid}`}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                    {bet.gameid || "-"}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {bet.matchDetails ? (
                                                        <div className="flex justify-center items-center gap-2">
                                                            <div className="flex gap-1">
                                                                {renderPlayerWithPhoto(bet.matchDetails.player1)}
                                                                {renderPlayerWithPhoto(bet.matchDetails.player2)}
                                                            </div>
                                                            <span className="text-gray-400 font-bold text-xs mx-1">
                                                                VS
                                                            </span>
                                                            <div className="flex gap-1">
                                                                {renderPlayerWithPhoto(bet.matchDetails.player3)}
                                                                {renderPlayerWithPhoto(bet.matchDetails.player4)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-center block">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                                    {(() => {
                                                        if (!bet.matchDetails)
                                                            return <span className="text-gray-400">-</span>;
                                                        const m = bet.matchDetails;
                                                        if (m.score1 != null && m.score2 != null) {
                                                            return (
                                                                <div className="font-bold text-gray-700">
                                                                    <span
                                                                        className={
                                                                            m.score1 > m.score2 ? "text-blue-600" : ""
                                                                        }
                                                                    >
                                                                        {m.score1}
                                                                    </span>
                                                                    <span className="mx-1">:</span>
                                                                    <span
                                                                        className={
                                                                            m.score2 > m.score1 ? "text-blue-600" : ""
                                                                        }
                                                                    >
                                                                        {m.score2}
                                                                    </span>
                                                                </div>
                                                            );
                                                        } else if (m.winner1id) {
                                                            const isTeam1Win =
                                                                m.winner1id === m.player1id ||
                                                                m.winner1id === m.player2id;
                                                            return (
                                                                <span className="font-bold text-blue-600">
                                                                    {isTeam1Win ? "팀 1 승리" : "팀 2 승리"}
                                                                </span>
                                                            );
                                                        }
                                                        return <span className="text-gray-400">결과 대기</span>;
                                                    })()}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex justify-center items-center gap-2">
                                                        {bet.betWinnerPlayers && bet.betWinnerPlayers.length > 0 ? (
                                                            bet.betWinnerPlayers.map((p: any) => (
                                                                <div key={p.id}>{renderPlayerWithPhoto(p)}</div>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-orange-600 font-bold">
                                                    {bet.betCoast?.toLocaleString() || 0} P
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                                    {!bet.isProcess ? (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">
                                                            결과 대기
                                                        </span>
                                                    ) : bet.isHit === "noDecision" ? (
                                                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold">
                                                            무승부 (환불)
                                                        </span>
                                                    ) : bet.isCorrect ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                                            적중
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                                                            미적중
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                    {bet.createdAt || bet.createat
                                                        ? new Date(bet.createdAt || bet.createat).toLocaleDateString(
                                                              "ko-KR",
                                                          )
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {bettings.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">베팅 데이터가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 왼쪽 사이드바 (메뉴) */}
            <div className="w-64 bg-white border-r shadow-sm flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">DB 대시보드</h1>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === "player" || item.id === "match") setSelectedClubId(null);
                                setActiveMenu(item.id);
                            }}
                            className={`text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                                activeMenu === item.id
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* 오른쪽 메인 컨텐츠 (DB 데이터 표출 영역) */}
            <div className="flex-1 p-8 overflow-y-auto h-screen">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {menuItems.find((m) => m.id === activeMenu)?.label} 현황
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md border min-h-[500px]">{renderContent()}</div>
            </div>
        </div>
    );
}
