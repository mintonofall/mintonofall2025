"use client";

import { useEffect, useState, useActionState } from "react";
import { getClub, getMatch, getWaitGames, getUser, getMatchs } from "@/lib/getUserGoHome";
import { logoutFromViewpage } from "@/lib/logout";
import Link from "next/link";
import handleLogin from "./action";
import { placeBet, getBettedMatchIds, getBettingHistory } from "./bettingAction";

const renderPlayer = (player: any, isSelected: boolean = false, onClick?: () => void) => {
    if (!player)
        return (
            <div className="bg-white border p-1 rounded shadow-sm flex items-center justify-center text-gray-300 h-full min-h-[60px]">
                -
            </div>
        );
    const avatarSrc = player.avater?.startsWith("https://imagedelivery.net/")
        ? `${player.avater}/avatar`
        : player.avater;
    return (
        <div
            onClick={onClick}
            className={`border p-1 rounded shadow-sm flex flex-col items-center justify-center gap-1 h-full min-h-[60px] transition-colors ${onClick ? "cursor-pointer" : ""} ${isSelected ? "bg-yellow-100 border-yellow-500" : "bg-white"}`}
        >
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
};

export default function ViewPage({ params }: { params: Promise<{ id: string }> }) {
    const [clubName, setClubName] = useState<string>("로딩 중...");
    const [courts, setCourts] = useState<any[]>([]);
    const [waitGames, setWaitGames] = useState<(any | null)[]>(Array(35).fill(null));
    const [activeTab, setActiveTab] = useState<"courts" | "waitlist" | "results" | "betting">("courts");
    const [user, setUser] = useState<any>(null);
    const [state, action] = useActionState(handleLogin, null);
    const [clubId, setClubId] = useState<number | null>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [allMatches, setAllMatches] = useState<any[]>([]);
    const [displayCount, setDisplayCount] = useState<number>(10);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [bettedMatchIds, setBettedMatchIds] = useState<number[] | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);
    const [bettingHistory, setBettingHistory] = useState<any[]>([]);
    const [betDisplayCount, setBetDisplayCount] = useState<number>(10);
    const [bettingModal, setBettingModal] = useState<{
        isOpen: boolean;
        userId: number | null;
        courtIndex: number | null;
        matchId: number | null;
        amount: number;
        targetPlayers: any[];
        startTime?: Date;
    }>({ isOpen: false, courtIndex: null, userId: null, matchId: null, amount: 0, targetPlayers: [] });
    const [isBettingSubmitting, setIsBettingSubmitting] = useState(false);

    const handlePlayerClick = (player: any) => {
        if (selectedPlayers.includes(player.id)) {
            setSelectedPlayers((prev) => prev.filter((id) => id !== player.id));
        } else if (selectedPlayers.length < 2) {
            setSelectedPlayers((prev) => [...prev, player.id]);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
                console.error("유저 정보를 가져오는 중 오류가 발생했습니다:", error);
            } finally {
                setIsUserLoaded(true);
            }
        };
        fetchUser();

        const intervalId = setInterval(fetchUser, 10000); // 10초마다 유저 정보 갱신 (포인트 동기화)
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resolvedParams = await params;
                const currentClubId = Number(resolvedParams.id);
                if (clubId === null) {
                    setClubId(currentClubId);
                }

                // 클럽 정보, 진행 중인 게임, 대기 게임, 게임 결과 데이터를 병렬로 가져옵니다.
                const [clubData, gameBoardData, waitGameData, matchData] = await Promise.all([
                    getClub(currentClubId),
                    getMatch(currentClubId),
                    getWaitGames(currentClubId),
                    getMatchs(currentClubId),
                ]);

                setClubName(clubData?.clubName || clubData?.clubName || "이름 없는 클럽");
                const currentPlayers = clubData?.players || [];
                setPlayers(currentPlayers);

                // 1. 코트 현황 (GameBoard) 세팅
                const howManyCourts = clubData?.howManyCourts || 0;
                const initialCourts = Array(howManyCourts).fill(null);

                if (gameBoardData && Array.isArray(gameBoardData)) {
                    gameBoardData.forEach((match: any) => {
                        if (match.CourtNumber > 0 && match.CourtNumber <= initialCourts.length) {
                            const p1 = currentPlayers.find((p: any) => p.id === match.player1id);
                            const p2 = currentPlayers.find((p: any) => p.id === match.player2id);
                            const p3 = currentPlayers.find((p: any) => p.id === match.player3id);
                            const p4 = currentPlayers.find((p: any) => p.id === match.player4id);

                            if (match.gameid && match.gameid !== "0" && p1) {
                                // 문자열 gameid 대신 Match 테이블의 실제 정수형 id를 찾아 저장합니다.
                                const currentMatch = Array.isArray(matchData)
                                    ? matchData.find((m: any) => m.gameid === match.gameid)
                                    : null;
                                initialCourts[match.CourtNumber - 1] = {
                                    p1,
                                    p2,
                                    p3,
                                    p4,
                                    matchId: currentMatch ? currentMatch.id : null,
                                    startTime: match.updateTime ? new Date(match.updateTime) : new Date(),
                                };
                            }
                        }
                    });
                }
                setCourts(initialCourts);

                // 2. 대기열 현황 (WaitGameList) 세팅 (35칸 그리드)
                const newGridData = Array(35).fill(null);
                if (waitGameData && Array.isArray(waitGameData)) {
                    waitGameData.forEach((game: any) => {
                        if (game.point !== null && game.point >= 0 && game.point < 35) {
                            const player = currentPlayers.find((p: any) => p.id === game.playerid);
                            if (player) {
                                newGridData[game.point] = player;
                            }
                        }
                    });
                }
                setWaitGames(newGridData);

                // 3. 게임 결과 세팅 (Match History)
                const today = new Date().toDateString();
                const historyMatches = Array.isArray(matchData) ? matchData : [];
                setAllMatches(historyMatches);
                const todaysMatches = historyMatches
                    .filter((m: any) => {
                        const matchDate = new Date(m.createat || m.updateTime || new Date()).toDateString();
                        return matchDate === today;
                    })
                    .sort((a: any, b: any) => {
                        return (b.id || 0) - (a.id || 0);
                    });
                setMatches(todaysMatches);
            } catch (error) {
                console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
                setClubName("데이터를 불러오지 못했습니다.");
            }
        };

        fetchData();

        // 현황판을 위해 10초마다 데이터를 자동으로 갱신합니다.
        const intervalId = setInterval(fetchData, 10000);
        return () => clearInterval(intervalId);
    }, [params, clubId]);

    // 백그라운드로 유저가 배팅했던 게임(Match ID)을 확인
    useEffect(() => {
        const fetchBettedMatches = async () => {
            if (!isUserLoaded) return;

            if (user?.id && clubId !== null) {
                try {
                    const matchIds = await getBettedMatchIds(user.id, clubId);
                    setBettedMatchIds(matchIds || []);
                } catch (error) {
                    console.error("유저 베팅 내역을 가져오는 중 오류가 발생했습니다:", error);
                    setBettedMatchIds([]);
                }
            } else {
                setBettedMatchIds([]);
            }
        };
        fetchBettedMatches();
        const intervalId = setInterval(fetchBettedMatches, 10000);
        return () => clearInterval(intervalId);
    }, [user?.id, clubId, isUserLoaded]);

    // 베팅 내역 가져오기 (배팅 내역 탭 활성화 시)
    useEffect(() => {
        const fetchHistory = async () => {
            if (user?.id && clubId !== null && activeTab === "betting") {
                try {
                    const history = await getBettingHistory(user.id, clubId);
                    setBettingHistory(history || []);
                } catch (error) {
                    console.error("베팅 내역을 가져오는 중 오류가 발생했습니다:", error);
                }
            }
        };
        fetchHistory();

        if (activeTab === "betting") {
            const intervalId = setInterval(fetchHistory, 10000); // 10초마다 베팅 내역 갱신 (적중 결과 등)
            return () => clearInterval(intervalId);
        }
    }, [user?.id, clubId, activeTab]);

    // 게임 결과 탭 무한 스크롤
    useEffect(() => {
        const handleScroll = () => {
            if (activeTab !== "results" && activeTab !== "betting") return;

            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight || document.documentElement.clientHeight;

            // 화면 끝에서 100px 정도 남았을 때 추가 로드
            if (scrollY + clientHeight >= scrollHeight - 100) {
                if (activeTab === "results") setDisplayCount((prev) => prev + 10);
                if (activeTab === "betting") setBetDisplayCount((prev) => prev + 10);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeTab]);

    // 탭이 바뀔 때 표시 개수 초기화
    useEffect(() => {
        if (activeTab === "results") setDisplayCount(10);
        if (activeTab === "betting") setBetDisplayCount(10);
    }, [activeTab]);

    useEffect(() => {
        // 모바일 브라우저에서 화면을 아래로 당겨서 새로고침하는 동작(Pull-to-refresh)을 막습니다.
        document.body.style.overscrollBehaviorY = "none";
        if (document.documentElement) {
            document.documentElement.style.overscrollBehaviorY = "none";
        }
        return () => {
            document.body.style.overscrollBehaviorY = "auto";
            if (document.documentElement) {
                document.documentElement.style.overscrollBehaviorY = "auto";
            }
        };
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen pb-24">
            {/* 상단 헤더 (유저 상태 표시) */}
            <div className="sticky top-0 z-40 flex justify-between items-center bg-white p-4 shadow-sm border-b border-gray-200">
                {user ? (
                    <>
                        <div className="font-bold text-gray-700 text-lg flex-1">
                            {user.userName}
                            <span className="text-sm font-normal text-gray-500 ml-1">님</span>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1">
                            <span className="text-xs text-gray-500 font-semibold mb-0.5">보유 포인트</span>
                            <span className="text-base sm:text-lg font-bold text-blue-600">
                                {user.point ? user.point.toLocaleString() : 0} P
                            </span>
                        </div>
                        <div className="flex justify-end flex-1">
                            <button
                                onClick={async () => {
                                    await logoutFromViewpage(clubId ?? 999);
                                    setUser(null);
                                    setBettedMatchIds([]);
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="로그아웃"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <form action={action} className="flex flex-1 items-center gap-2 mr-2">
                            {clubId !== null && <input type="hidden" name="clubId" value={clubId} />}
                            <input
                                name="userName"
                                type="text"
                                placeholder="아이디"
                                className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full max-w-[100px] sm:max-w-[150px] outline-none focus:border-blue-500"
                                required
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="비밀번호"
                                className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full max-w-[100px] sm:max-w-[150px] outline-none focus:border-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded text-sm whitespace-nowrap transition-colors"
                            >
                                로그인
                            </button>
                            {state?.error?.uniqueUser && (
                                <span className="text-red-500 text-xs hidden md:inline">{state.error.uniqueUser}</span>
                            )}
                        </form>
                        <Link
                            href={clubId !== null ? `/createUser?clubId=${clubId}` : "/createUser"}
                            className="flex items-center gap-1 p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                            title="가입하기"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                            <span className="font-semibold text-sm">가입하기</span>
                        </Link>
                    </>
                )}
            </div>

            <div className="p-6 flex flex-col gap-6">
                {activeTab === "courts" && (
                    <div className="flex-1 bg-white p-4 lg:p-6 rounded-lg shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-2 lg:mb-4 text-blue-600 border-b pb-2">
                            {clubName} 진행 중인 코트
                        </h2>
                        <h2 className="text-sm lg:text-2xl mb-2 lg:mb-4 text-gray-500 border-b pb-2">
                            예상하는 승리자를 한명 혹은 두명을 선택하세요
                        </h2>
                        <div className="flex flex-col gap-2">
                            {courts.map((court, index) => {
                                const isLeagueGame =
                                    court &&
                                    court.p1?.isJoinLeague &&
                                    court.p2?.isJoinLeague &&
                                    court.p3?.isJoinLeague &&
                                    court.p4?.isJoinLeague;

                                let elapsedMinutes = 0;
                                let isBettingClosed = false;
                                if (court && court.startTime) {
                                    const elapsedMs = currentTime.getTime() - court.startTime.getTime();
                                    elapsedMinutes = Math.floor(elapsedMs / 60000);
                                    if (elapsedMinutes >= 4) {
                                        isBettingClosed = true;
                                    }
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`p-2 rounded border-2 relative ${court ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-bold text-gray-700">Court {index + 1}</h3>
                                                {isLeagueGame && (
                                                    <span className="px-2 py-0.5 bg-yellow-400 text-yellow-800 text-[10px] font-bold rounded">
                                                        리그게임
                                                    </span>
                                                )}
                                            </div>
                                            {court && court.startTime && (
                                                <span
                                                    className={`text-xs font-semibold ${isBettingClosed ? "text-red-500" : "text-blue-500"}`}
                                                >
                                                    {elapsedMinutes >= 0 ? `${elapsedMinutes}분 경과` : "시작 전"}
                                                </span>
                                            )}
                                        </div>
                                        {court ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="grid grid-cols-4 gap-2 text-center font-medium text-gray-800">
                                                    {renderPlayer(
                                                        court.p1,
                                                        court.p1 && selectedPlayers.includes(court.p1.id),
                                                        () => court.p1 && handlePlayerClick(court.p1),
                                                    )}
                                                    {renderPlayer(
                                                        court.p2,
                                                        court.p2 && selectedPlayers.includes(court.p2.id),
                                                        () => court.p2 && handlePlayerClick(court.p2),
                                                    )}
                                                    {renderPlayer(
                                                        court.p3,
                                                        court.p3 && selectedPlayers.includes(court.p3.id),
                                                        () => court.p3 && handlePlayerClick(court.p3),
                                                    )}
                                                    {renderPlayer(
                                                        court.p4,
                                                        court.p4 && selectedPlayers.includes(court.p4.id),
                                                        () => court.p4 && handlePlayerClick(court.p4),
                                                    )}
                                                </div>
                                                <div className="flex justify-end items-center gap-2 mt-1 pt-2 border-t border-gray-200">
                                                    {court.matchId &&
                                                    (bettedMatchIds === null ||
                                                        bettedMatchIds.includes(court.matchId)) ? (
                                                        <button
                                                            disabled
                                                            className="bg-gray-300 text-white font-semibold py-1.5 px-4 rounded text-sm w-full cursor-not-allowed"
                                                        >
                                                            이미 베팅한 시합입니다
                                                        </button>
                                                    ) : isBettingClosed ? (
                                                        <button
                                                            disabled
                                                            className="bg-red-400 text-white font-semibold py-1.5 px-4 rounded text-sm w-full cursor-not-allowed"
                                                        >
                                                            베팅 마감
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <input
                                                                id={`bet-input-${index}`}
                                                                type="number"
                                                                defaultValue={1000}
                                                                step={100}
                                                                min={100}
                                                                className="border border-gray-300 rounded px-2 py-1 text-sm w-20 outline-none focus:border-orange-500 text-right"
                                                            />
                                                            <span className="text-sm text-gray-600 font-medium mr-1">
                                                                P
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (!user) {
                                                                        alert("로그인이 필요합니다.");
                                                                        return;
                                                                    }
                                                                    if (!court.matchId) {
                                                                        alert(
                                                                            "게임 정보가 아직 동기화되지 않았습니다. 잠시 후 다시 시도해주세요.",
                                                                        );
                                                                        return;
                                                                    }
                                                                    if (selectedPlayers.length === 0) {
                                                                        alert("베팅할 선수를 선택해주세요.");
                                                                        return;
                                                                    }

                                                                    const inputEl = document.getElementById(
                                                                        `bet-input-${index}`,
                                                                    ) as HTMLInputElement;
                                                                    const amount = inputEl
                                                                        ? Number(inputEl.value)
                                                                        : 1000;

                                                                    if (user.point < amount) {
                                                                        alert("보유 포인트가 부족합니다.");
                                                                        return;
                                                                    }

                                                                    const targetPlayers = [
                                                                        court.p1,
                                                                        court.p2,
                                                                        court.p3,
                                                                        court.p4,
                                                                    ].filter(
                                                                        (p) => p && selectedPlayers.includes(p.id),
                                                                    );

                                                                    if (targetPlayers.length === 0) {
                                                                        alert("해당 코트의 선수를 선택해주세요.");
                                                                        return;
                                                                    }

                                                                    setBettingModal({
                                                                        isOpen: true,
                                                                        userId: user.id,
                                                                        courtIndex: index,
                                                                        matchId: court.matchId,
                                                                        amount,
                                                                        targetPlayers,
                                                                        startTime: court.startTime,
                                                                    });
                                                                }}
                                                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1.5 px-4 rounded text-sm transition-colors shadow-sm"
                                                            >
                                                                베팅하기
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 text-center py-4 font-medium">빈 코트</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === "waitlist" && (
                    <div className="flex-1 bg-white p-4 lg:p-6 rounded-lg shadow-md overflow-y-auto">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-2 lg:mb-4 text-purple-600 border-b pb-2">
                            대기 게임 리스트
                        </h2>
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: 7 }).map((_, rowIndex) => {
                                const startIndex = rowIndex * 5;
                                const p1 = waitGames[startIndex + 1];
                                const p2 = waitGames[startIndex + 2];
                                const p3 = waitGames[startIndex + 3];
                                const p4 = waitGames[startIndex + 4];

                                // 대기열에 선수가 한 명이라도 있는 경우만 렌더링
                                if (!p1 && !p2 && !p3 && !p4) return null;

                                return (
                                    <div
                                        key={rowIndex}
                                        className="flex bg-gray-50 p-3 rounded border items-center gap-4"
                                    >
                                        <div className="font-bold text-purple-700 min-w-[60px] text-center">
                                            대기 {rowIndex + 1}
                                        </div>
                                        <div className="grid grid-cols-4 flex-1 text-center gap-2">
                                            {renderPlayer(p1)}
                                            {renderPlayer(p2)}
                                            {renderPlayer(p3)}
                                            {renderPlayer(p4)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === "results" && (
                    <div className="flex-1 bg-white p-4 lg:p-6 rounded-lg shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-2 lg:mb-4 text-green-600 border-b pb-2">
                            오늘의 게임 결과
                        </h2>
                        <div className="flex flex-col gap-4">
                            {matches.slice(0, displayCount).map((match: any, index: number) => {
                                const p1 = players.find((p: any) => p.id === match.player1id);
                                const p2 = players.find((p: any) => p.id === match.player2id);
                                const p3 = players.find((p: any) => p.id === match.player3id);
                                const p4 = players.find((p: any) => p.id === match.player4id);

                                const renderResultPlayer = (player: any) => {
                                    if (!player) return renderPlayer(player);
                                    const isWinner = match.winner1id === player.id || match.winner2id === player.id;
                                    return (
                                        <div className="relative h-full">
                                            {isWinner && (
                                                <span className="absolute -top-2 -left-1 bg-yellow-400 text-yellow-800 text-[10px] px-1 py-0.5 rounded shadow font-bold z-10">
                                                    WIN
                                                </span>
                                            )}
                                            {renderPlayer(player)}
                                        </div>
                                    );
                                };

                                return (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-2">
                                            <span>
                                                {match.createat
                                                    ? new Date(match.createat).toLocaleTimeString([], {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : `Game ${matches.length - index}`}{" "}
                                                종료
                                            </span>
                                            <span>게임 번호: {match.id}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 text-center">
                                            {renderResultPlayer(p1)}
                                            {renderResultPlayer(p2)}
                                            {renderResultPlayer(p3)}
                                            {renderResultPlayer(p4)}
                                        </div>
                                    </div>
                                );
                            })}
                            {matches.length === 0 && (
                                <div className="text-center text-gray-500 py-10">오늘 완료된 게임이 없습니다.</div>
                            )}
                            {matches.length > 0 && displayCount < matches.length && (
                                <div className="text-center text-sm text-gray-400 py-2">스크롤하여 더 보기...</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "betting" && (
                    <div className="flex-1 bg-white p-4 lg:p-6 rounded-lg shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-2 lg:mb-4 text-orange-500 border-b pb-2">
                            배팅 내역
                        </h2>
                        {!user ? (
                            <div className="text-center text-gray-500 py-10">로그인이 필요합니다.</div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {bettingHistory.slice(0, betDisplayCount).map((bet: any, index: number) => {
                                    const match = allMatches.find((m) => m.id === bet.gameid);
                                    const betWinnerIds = Array.isArray(bet.betWinner) ? bet.betWinner : [];

                                    return (
                                        <div
                                            key={index}
                                            className="bg-orange-50 p-4 rounded-lg border border-orange-100 shadow-sm flex flex-col gap-3"
                                        >
                                            <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                                                <span className="text-sm font-semibold text-gray-600">
                                                    게임 번호: {bet.gameid}
                                                </span>
                                                <span className="font-bold text-orange-600 text-lg">
                                                    {bet.betCoast?.toLocaleString() || 0} P
                                                </span>
                                            </div>
                                            {match ? (
                                                <div className="grid grid-cols-4 gap-2 text-center">
                                                    {[
                                                        match.player1id,
                                                        match.player2id,
                                                        match.player3id,
                                                        match.player4id,
                                                    ].map((pid, idx) => {
                                                        const p = players.find((pl) => pl.id === pid);
                                                        const isBetted = betWinnerIds.includes(pid);
                                                        const isWinner =
                                                            bet.isProcess &&
                                                            (match.winner1id === pid || match.winner2id === pid) &&
                                                            pid !== null &&
                                                            pid !== undefined;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="relative h-full pointer-events-none"
                                                            >
                                                                {isWinner && (
                                                                    <span className="absolute -top-2 -left-1 bg-yellow-400 text-yellow-800 text-[10px] px-1 py-0.5 rounded shadow font-bold z-10">
                                                                        WIN
                                                                    </span>
                                                                )}
                                                                {renderPlayer(p, isBetted)}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex gap-4">
                                                    {betWinnerIds.length > 0 ? (
                                                        betWinnerIds.map((pid: number) => {
                                                            const p = players.find((pl) => pl.id === pid);
                                                            return (
                                                                <div key={pid} className="w-16 pointer-events-none">
                                                                    {renderPlayer(p, true)}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">
                                                            선수 정보를 찾을 수 없습니다.
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {bet.isProcess ? (
                                                <div
                                                    className={`text-center font-bold p-2 rounded mt-2 ${bet.isHit === "noDecision" ? "bg-gray-100 text-gray-700" : bet.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                >
                                                    {bet.isHit === "noDecision" ? (
                                                        <span>
                                                            무승부 (베팅 취소) +{bet.betCoast?.toLocaleString()} P 환불
                                                        </span>
                                                    ) : bet.isCorrect ? (
                                                        <span>
                                                            🎉 적중! +
                                                            {(bet.betWinner?.length === 1
                                                                ? bet.betCoast * 2
                                                                : bet.betWinner?.length === 2
                                                                  ? bet.betCoast * 3
                                                                  : 0
                                                            ).toLocaleString()}{" "}
                                                            P
                                                        </span>
                                                    ) : (
                                                        <span>😢 미적중 -{bet.betCoast?.toLocaleString()} P</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center font-bold p-2 rounded mt-2 bg-gray-100 text-gray-500">
                                                    결과 대기 중
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {bettingHistory.length === 0 && (
                                    <div className="text-center text-gray-500 py-10">베팅 내역이 없습니다.</div>
                                )}
                                {bettingHistory.length > 0 && betDisplayCount < bettingHistory.length && (
                                    <div className="text-center text-sm text-gray-400 py-2">스크롤하여 더 보기...</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 베팅 확인 모달 */}
            {bettingModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-center text-orange-600">베팅 확인</h2>
                        <div className="mb-6 flex flex-col items-center gap-4">
                            <div className="text-sm text-gray-600 font-medium">선택된 선수</div>
                            <div className="flex gap-4">
                                {bettingModal.targetPlayers.map((player: any) => (
                                    <div key={player.id} className="pointer-events-none w-24">
                                        {renderPlayer(player)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-lg font-semibold text-gray-800 mt-2">
                                베팅 금액:{" "}
                                <span className="text-blue-600">{bettingModal.amount.toLocaleString()} P</span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors"
                                onClick={() => setBettingModal({ ...bettingModal, isOpen: false })}
                            >
                                취소
                            </button>
                            <button
                                disabled={isBettingSubmitting}
                                className={`flex-1 px-4 py-2 text-white rounded font-bold transition-colors ${isBettingSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                onClick={async () => {
                                    if (isBettingSubmitting) return;

                                    if (bettingModal.startTime) {
                                        const elapsedMs = new Date().getTime() - bettingModal.startTime.getTime();
                                        if (elapsedMs >= 4 * 60 * 1000) {
                                            alert("베팅 시간이 마감되었습니다 (경기 시작 후 4분 경과).");
                                            setBettingModal({ ...bettingModal, isOpen: false });
                                            setSelectedPlayers([]);
                                            return;
                                        }
                                    }

                                    if (user.point < bettingModal.amount) {
                                        alert("보유 포인트가 부족합니다.");
                                        return;
                                    }

                                    if (bettingModal.matchId && bettedMatchIds?.includes(bettingModal.matchId)) {
                                        alert("이미 베팅한 시합입니다.");
                                        setBettingModal({ ...bettingModal, isOpen: false });
                                        setSelectedPlayers([]);
                                        return;
                                    }

                                    setIsBettingSubmitting(true);
                                    try {
                                        const playerIds: number[] = bettingModal.targetPlayers.map((p) => p.id);
                                        const result = await placeBet(
                                            user.id,
                                            clubId!,
                                            bettingModal.matchId!,
                                            bettingModal.amount,
                                            playerIds,
                                        );

                                        if (result.success) {
                                            alert("베팅이 완료되었습니다.");
                                            setUser({ ...user, point: user.point - bettingModal.amount }); // 포인트 즉시 반영
                                            setBettedMatchIds((prev) => [...(prev || []), bettingModal.matchId!]); // 베팅 완료 시 즉시 상태 업데이트
                                        } else {
                                            alert(result.message || "베팅 처리에 실패했습니다.");
                                        }

                                        setBettingModal({ ...bettingModal, isOpen: false });
                                        setSelectedPlayers([]);
                                    } finally {
                                        setIsBettingSubmitting(false);
                                    }
                                }}
                            >
                                {isBettingSubmitting ? "처리 중..." : "확정"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 하단 네비게이션 바 */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                <div className="flex justify-around items-center py-3 max-w-4xl mx-auto">
                    <button
                        onClick={() => setActiveTab("courts")}
                        className={`flex flex-col items-center gap-1 ${activeTab === "courts" ? "text-blue-600" : "text-gray-400"} hover:text-blue-800 transition-colors w-1/4`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        </svg>
                        <span className="text-xs font-semibold">진행코트</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("waitlist")}
                        className={`flex flex-col items-center gap-1 ${activeTab === "waitlist" ? "text-purple-600" : "text-gray-400"} hover:text-purple-600 transition-colors w-1/4 border-l border-gray-100`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-xs font-semibold">대기게임</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("results")}
                        className={`flex flex-col items-center gap-1 ${activeTab === "results" ? "text-green-600" : "text-gray-400"} hover:text-green-600 transition-colors w-1/4 border-l border-gray-100`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                        <span className="text-xs font-semibold">게임결과</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("betting")}
                        className={`flex flex-col items-center gap-1 ${activeTab === "betting" ? "text-orange-500" : "text-gray-400"} hover:text-orange-500 transition-colors w-1/4 border-l border-gray-100`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <span className="text-xs font-semibold">배팅내역</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
