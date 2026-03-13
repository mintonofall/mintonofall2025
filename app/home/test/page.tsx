"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getClub,
    pushWaitPlayerList,
    getWaitPlayerList,
    exitPlayer,
    resetWaitGames,
    getWaitGames,
    startMatch,
    createMatch,
    getMatch,
    deleteMatch,
    gameOneUp,
    oneGameDown,
    endMatch,
    updatePlayer,
    getPlayerMatches,
    createPlayer,
} from "@/lib/getUserGoHome";
import LeftTopSection from "./LeftTopSection";
import LeftBottomSection from "./LeftBottomSection";
import RightSection from "./RightSection";
import Loading from "./loading";
import GameResultModal from "./GameResultModal";
import EditPlayerModal from "./EditPlayerModal";
import PlayerHistoryModal from "./PlayerHistoryModal";
import AddPlayerModal from "./AddPlayerModal";

const CHO_HANGUL = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
];

const getChosung = (str: string) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i) - 44032;
        if (code > -1 && code < 11172) {
            result += CHO_HANGUL[Math.floor(code / 588)];
        } else {
            result += str.charAt(i);
        }
    }
    return result;
};

export default function TestPage() {
    const [players, setPlayers] = useState<any[]>([]);
    const [showPlayerList, setShowPlayerList] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [waitPlayerList, setWaitPlayerList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCell, setSelectedCell] = useState<number | null>(1);
    const [gridData, setGridData] = useState<(any | null)[]>(Array(35).fill(null));
    const [howManyCourts, setHowManyCourts] = useState<number>(0);
    const [courtPointer, setCourtPointer] = useState<number>(0);
    const [courts, setCourts] = useState<any[]>([]);
    const [sortCriteria, setSortCriteria] = useState("enterTime");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [gameResultModal, setGameResultModal] = useState<{ isOpen: boolean; courtIndex: number | null }>({
        isOpen: false,
        courtIndex: null,
    });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; player: any | null }>({
        isOpen: false,
        player: null,
    });
    const [historyModal, setHistoryModal] = useState<{ isOpen: boolean; player: any | null }>({
        isOpen: false,
        player: null,
    });
    const [addModalOpen, setAddModalOpen] = useState(false);
    const clubId = 14;

    const fetchData = async () => {
        console.log("fetched data");
        const data = await getClub(clubId);
        const matchData = await getMatch(clubId);
        setHowManyCourts(data?.howManyCourts || 0);
        const latestPlayers = data?.players || [];
        setPlayers(latestPlayers);

        const waitData = await getWaitPlayerList(clubId);
        const waitGameData = await getWaitGames(clubId);

        setWaitPlayerList(
            waitData.map((item) => {
                const gameData = waitGameData?.find((g: any) => g.playerid === item.Playerid);
                return { ...item.player, clickedTime: gameData ? gameData.updateTime : item.enterDate };
            }),
        );

        const newGridData = Array(35).fill(null);
        if (waitGameData && Array.isArray(waitGameData)) {
            waitGameData.forEach((game: any) => {
                if (game.point !== null && game.point >= 0 && game.point < 35) {
                    const player = latestPlayers.find((p: any) => p.id === game.playerid);
                    if (player) {
                        newGridData[game.point] = { ...player, isSaved: true };
                    }
                }
            });
        }
        setGridData(newGridData);

        const initialCourts = Array(data?.howManyCourts || 0).fill(null);
        if (matchData && Array.isArray(matchData)) {
            matchData.forEach((match: any) => {
                if (match.CourtNumber > 0 && match.CourtNumber <= initialCourts.length) {
                    const p1 = latestPlayers.find((p: any) => p.id === match.player1id);
                    const p2 = latestPlayers.find((p: any) => p.id === match.player2id);
                    const p3 = latestPlayers.find((p: any) => p.id === match.player3id);
                    const p4 = latestPlayers.find((p: any) => p.id === match.player4id);

                    if (match.gameid && p1) {
                        initialCourts[match.CourtNumber - 1] = {
                            p1,
                            p2,
                            p3,
                            p4,
                            gameId: match.gameid,
                            startTime: match.updateTime,
                        };
                    }
                }
            });
        }
        setCourts(initialCourts);

        let nextEmptyCourt = 0;
        for (let i = 0; i < initialCourts.length; i++) {
            if (!initialCourts[i]) {
                nextEmptyCourt = i;
                break;
            }
        }
        setCourtPointer(nextEmptyCourt);

        let firstEmptyIndex = 0;
        while (firstEmptyIndex < 35 && (firstEmptyIndex % 5 === 0 || newGridData[firstEmptyIndex])) {
            firstEmptyIndex++;
        }
        setSelectedCell(firstEmptyIndex < 35 ? firstEmptyIndex : 1);

        console.log(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // 안드로이드 크롬 등 모바일 브라우저에서 화면을 아래로 당겨서 새로고침하는 동작을 막습니다.
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

    const handleExit = async (playerId: number) => {
        setWaitPlayerList((prev) => prev.filter((p) => p.id !== playerId));
        await exitPlayer(playerId, clubId);
    };

    const handleSort = (criteria: string) => {
        if (criteria === "participating") {
            setSortCriteria(criteria);
            return;
        }
        if (sortCriteria === criteria) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortCriteria(criteria);
            setSortDirection("asc");
        }
    };

    const getTodayGameCount = (gameDatas: any[]) => {
        if (!gameDatas || !Array.isArray(gameDatas)) return 0;
        const today = new Date().toDateString();
        return gameDatas.filter((date) => new Date(date).toDateString() === today).length;
    };

    const sortedWaitPlayerList = useMemo(() => {
        const list = [...waitPlayerList];
        const direction = sortDirection === "asc" ? 1 : -1;
        switch (sortCriteria) {
            case "name":
                return list.sort((a, b) => a.name.localeCompare(b.name) * direction);
            case "grade":
                const gradeOrder: { [key: string]: number } = { S: 0, A: 1, B: 2, C: 3, D: 4, E: 5 };
                return list.sort((a, b) => ((gradeOrder[a.grade] ?? 99) - (gradeOrder[b.grade] ?? 99)) * direction);
            case "games":
                return list.sort(
                    (a, b) => (getTodayGameCount(a.gameDatas) - getTodayGameCount(b.gameDatas)) * direction,
                );
            case "participating":
                return list.sort((a, b) => {
                    const aInCourt = courts.some(
                        (c) => c && (c.p1?.id === a.id || c.p2?.id === a.id || c.p3?.id === a.id || c.p4?.id === a.id),
                    );
                    const bInCourt = courts.some(
                        (c) => c && (c.p1?.id === b.id || c.p2?.id === b.id || c.p3?.id === b.id || c.p4?.id === b.id),
                    );
                    const aInGrid = gridData.some((p) => p && p.id === a.id);
                    const bInGrid = gridData.some((p) => p && p.id === b.id);

                    const getScore = (inCourt: boolean, inGrid: boolean) => {
                        if (inGrid) return 2; // 연한 녹색 (우선순위 높음)
                        if (inCourt) return 1; // 진한 녹색
                        return 0; // 배경색 없음
                    };
                    return getScore(aInCourt, aInGrid) - getScore(bInCourt, bInGrid);
                });
            case "enterTime":
            default:
                return list;
        }
    }, [waitPlayerList, sortCriteria, sortDirection, courts, gridData]);

    const handlePlayerSelect = async (player: any) => {
        if (selectedCell === null) return;

        const updatedPlayer = {
            ...player,
            isSaved: false,
        };

        const newGridData = [...gridData];
        newGridData[selectedCell] = updatedPlayer;
        setGridData(newGridData);

        setWaitPlayerList((prev) => {
            const newList = prev.filter((p) => p.id !== player.id);
            return [{ ...player, clickedTime: new Date() }, ...newList];
        });

        let nextCell = selectedCell + 1;
        while (nextCell < 35 && (nextCell % 5 === 0 || newGridData[nextCell])) {
            nextCell++;
        }

        if (nextCell < 35) {
            setSelectedCell(nextCell);
        } else {
            let nextEmpty = 1;
            while (nextEmpty < 35 && (nextEmpty % 5 === 0 || newGridData[nextEmpty])) {
                nextEmpty++;
            }
            setSelectedCell(nextEmpty < 35 ? nextEmpty : 1);
        }

        const waitGameList = newGridData
            .map((p, index) => (p ? { point: index, playerid: p.id, clubid: clubId } : null))
            .filter((p) => p !== null);
        await resetWaitGames(clubId, waitGameList);

        setGridData((prev) => {
            const newData = [...prev];
            if (newData[selectedCell]) {
                newData[selectedCell] = { ...newData[selectedCell], isSaved: true };
            }
            return newData;
        });
    };

    const handleGameStart = async (startIndex: number) => {
        const p1 = gridData[startIndex + 1];
        const p2 = gridData[startIndex + 2];
        const p3 = gridData[startIndex + 3];
        const p4 = gridData[startIndex + 4];

        if (!p1 || !p2 || !p3 || !p4) {
            alert("4명을 채워주세요");
            return;
        }

        const newPlayers = [p1, p2, p3, p4];
        for (const player of newPlayers) {
            const playingCourtIndex = courts.findIndex(
                (court) =>
                    court &&
                    (court.p1?.id === player.id ||
                        court.p2?.id === player.id ||
                        court.p3?.id === player.id ||
                        court.p4?.id === player.id),
            );

            if (playingCourtIndex !== -1) {
                alert(`${player.name} 선수가 ${playingCourtIndex + 1}번 코트에 들어가 있습니다.`);
                return;
            }
        }

        if (courts[courtPointer]) {
            alert("해당 코트가 비어있지 않습니다.");
            return;
        }

        const gameId =
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                      const r = (Math.random() * 16) | 0;
                      const v = c === "x" ? r : (r & 0x3) | 0x8;
                      return v.toString(16);
                  });
        const targetCourtIndex = courtPointer;

        setCourts((prev) => {
            const newCourts = [...prev];
            newCourts[targetCourtIndex] = { p1, p2, p3, p4, gameId, isLoading: true, startTime: new Date() };

            let nextEmpty = -1;
            for (let i = 0; i < newCourts.length; i++) {
                if (!newCourts[i]) {
                    nextEmpty = i;
                    break;
                }
            }
            if (nextEmpty !== -1) {
                setTimeout(() => setCourtPointer(nextEmpty), 0);
            }
            return newCourts;
        });

        const remainingPlayers = [];
        const indicesToRemove = new Set([startIndex + 1, startIndex + 2, startIndex + 3, startIndex + 4]);

        for (let i = 0; i < 35; i++) {
            if (i % 5 !== 0 && gridData[i]) {
                if (!indicesToRemove.has(i)) {
                    remainingPlayers.push(gridData[i]);
                }
            }
        }

        const newGridData = Array(35).fill(null);
        let playerIdx = 0;
        for (let i = 0; i < 35; i++) {
            if (i % 5 !== 0) {
                if (playerIdx < remainingPlayers.length) {
                    newGridData[i] = remainingPlayers[playerIdx];
                    playerIdx++;
                }
            }
        }
        setGridData(newGridData);

        let firstEmptyIndex = 0;
        while (firstEmptyIndex < 35 && (firstEmptyIndex % 5 === 0 || newGridData[firstEmptyIndex])) {
            firstEmptyIndex++;
        }
        setSelectedCell(firstEmptyIndex < 35 ? firstEmptyIndex : null);

        try {
            await createMatch(gameId, clubId, p1.id, p2.id, p3.id, p4.id, []);
            await startMatch(clubId, p1.id, p2.id, p3.id, p4.id, targetCourtIndex + 1, gameId);

            const playerIds = [p1.id, p2.id, p3.id, p4.id];
            await Promise.all(playerIds.map((id) => gameOneUp(id)));

            const updatePlayerState = (p: any) => {
                if (playerIds.includes(p.id)) {
                    return {
                        ...p,
                        games: (p.games || 0) + 1,
                        gameDatas: [...(p.gameDatas || []), new Date()],
                    };
                }
                return p;
            };
            setWaitPlayerList((prev) => prev.map(updatePlayerState));
            setPlayers((prev) => prev.map(updatePlayerState));

            const waitGameList = newGridData
                .map((p, index) => (p ? { point: index, playerid: p.id, clubid: clubId } : null))
                .filter((p) => p !== null);
            await resetWaitGames(clubId, waitGameList);
            setCourts((prev) => {
                const newCourts = [...prev];
                if (newCourts[targetCourtIndex] && newCourts[targetCourtIndex].gameId === gameId) {
                    newCourts[targetCourtIndex] = { ...newCourts[targetCourtIndex], isLoading: false };
                }
                return newCourts;
            });
        } catch (e) {
            console.error(e);
            alert("게임 생성 중 오류가 발생했습니다.");
        }
    };

    const handleRemovePlayerFromGrid = async (index: number) => {
        const newGridData = [...gridData];
        newGridData[index] = null;
        setGridData(newGridData);
        setSelectedCell(index);

        const waitGameList = newGridData
            .map((p, index) => (p ? { point: index, playerid: p.id, clubid: clubId } : null))
            .filter((p) => p !== null);
        await resetWaitGames(clubId, waitGameList);
    };

    const handleGameEnd = async (index: number) => {
        setGameResultModal({ isOpen: true, courtIndex: index });
    };

    const handleGameCancel = async (index: number) => {
        const courtToCancel = courts[index];
        if (!courtToCancel || !courtToCancel.gameId) return;

        if (confirm(`${index + 1}번 코트의 경기를 정말 취소하시겠습니까?`)) {
            // 화면에 먼저 반영 (Optimistic Update)
            setCourts((prev) => {
                const newCourts = [...prev];
                newCourts[index] = null;
                return newCourts;
            });

            const playerIds = [courtToCancel.p1.id, courtToCancel.p2.id, courtToCancel.p3.id, courtToCancel.p4.id];
            const updatePlayerState = (p: any) => {
                if (playerIds.includes(p.id)) {
                    return {
                        ...p,
                        games: Math.max(0, (p.games || 0) - 1),
                        gameDatas: p.gameDatas?.slice(0, -1) || [],
                    };
                }
                return p;
            };
            setWaitPlayerList((prev) => prev.map(updatePlayerState));
            setPlayers((prev) => prev.map(updatePlayerState));

            // 백그라운드에서 DB 처리
            try {
                await deleteMatch(courtToCancel.gameId);
                await Promise.all(playerIds.map((id) => oneGameDown(id)));
            } catch (e) {
                console.error("게임 취소 실패:", e);
                alert("게임 취소 중 오류가 발생했습니다.");
                // 필요시 여기에 UI 롤백 로직을 추가할 수 있습니다.
            }
        }
    };

    const handleGameResult = async (winnersKey: string[]) => {
        const { courtIndex } = gameResultModal;
        if (courtIndex === null) return;

        const court = courts[courtIndex];
        if (!court) return;

        const isLeagueGame =
            court.p1?.isJoinLeague && court.p2?.isJoinLeague && court.p3?.isJoinLeague && court.p4?.isJoinLeague;

        const winnerIds = winnersKey.map((key) => court[key].id);

        setCourts((prev) => {
            const newCourts = [...prev];
            newCourts[courtIndex] = null;
            return newCourts;
        });
        setCourtPointer(courtIndex);
        setGameResultModal({ isOpen: false, courtIndex: null });

        await endMatch(court.gameId, winnerIds, isLeagueGame);
    };

    const handleUpdatePlayer = async (updatedPlayer: any) => {
        await updatePlayer(updatedPlayer);
        setEditModal({ isOpen: false, player: null });
        fetchData();
    };

    const handleHistoryClick = (player: any) => {
        setHistoryModal({ isOpen: true, player });
    };

    const handleCreatePlayer = async (newPlayer: any) => {
        try {
            const createdPlayer = await createPlayer({ ...newPlayer, clubid: clubId });
            await pushWaitPlayerList(createdPlayer.id, clubId);

            // 대기 명단 맨 위에 추가
            setWaitPlayerList((prev) => [{ ...createdPlayer, clickedTime: new Date() }, ...prev]);
            // 전체 선수 목록에도 추가
            setPlayers((prev) => [...prev, createdPlayer]);

            setAddModalOpen(false);
            fetchData();
        } catch (e) {
            console.error("Failed to create player", e);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex h-screen p-4 gap-4">
            <div className="w-[70%] flex flex-col gap-4">
                <LeftTopSection
                    howManyCourts={howManyCourts}
                    courtPointer={courtPointer}
                    setCourtPointer={setCourtPointer}
                    courts={courts}
                    onGameEnd={handleGameEnd}
                    onGameCancel={handleGameCancel}
                />
                <LeftBottomSection
                    selectedCell={selectedCell}
                    onCellClick={setSelectedCell}
                    gridData={gridData}
                    onRemovePlayer={handleRemovePlayerFromGrid}
                    onGameStart={handleGameStart}
                />
            </div>
            <RightSection
                waitPlayerList={sortedWaitPlayerList}
                onExit={handleExit}
                onPlayerClick={handlePlayerSelect}
                gridData={gridData}
                courts={courts}
                onSort={handleSort}
                currentSort={sortCriteria}
                onEdit={(player) => setEditModal({ isOpen: true, player })}
                onHistoryClick={handleHistoryClick}
            />

            <GameResultModal
                isOpen={gameResultModal.isOpen}
                onClose={() => setGameResultModal({ ...gameResultModal, isOpen: false })}
                players={gameResultModal.courtIndex !== null ? courts[gameResultModal.courtIndex] : null}
                onConfirm={handleGameResult}
            />

            <EditPlayerModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ ...editModal, isOpen: false })}
                player={editModal.player}
                onConfirm={handleUpdatePlayer}
            />

            <PlayerHistoryModal
                isOpen={historyModal.isOpen}
                onClose={() => setHistoryModal({ isOpen: false, player: null })}
                player={historyModal.player}
            />

            <AddPlayerModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onConfirm={handleCreatePlayer}
            />

            <div className="fixed bottom-4 right-4">
                <button
                    className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setShowPlayerList(true)}
                >
                    <span className="text-3xl pb-1">+</span>
                </button>
            </div>

            {showPlayerList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div className="absolute top-10 right-10 bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPlayerList(false)}
                        >
                            <span className="text-2xl">×</span>
                        </button>
                        <div className="flex justify-between items-center mb-4 pr-6">
                            <h2 className="text-xl font-bold">Players List</h2>
                            <button
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                onClick={() => {
                                    setAddModalOpen(true);
                                    setShowPlayerList(false);
                                }}
                            >
                                선수 추가
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="이름 검색"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="flex flex-col gap-2">
                            {players
                                .filter((player) => {
                                    const name = player.name;
                                    const search = searchTerm;
                                    return (
                                        name.toLowerCase().includes(search.toLowerCase()) ||
                                        getChosung(name).includes(search)
                                    );
                                })
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((player, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            if (waitPlayerList.some((p) => p.id === player.id)) {
                                                alert("이미 입장한 선수입니다");
                                                return;
                                            }
                                            setShowPlayerList(false);
                                            setWaitPlayerList((prev) => [
                                                { ...player, clickedTime: new Date() },
                                                ...prev,
                                            ]);
                                            pushWaitPlayerList(player.id, clubId);
                                        }}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            {player.avater ? (
                                                <img
                                                    src={`${player.avater}`}
                                                    alt={player.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{player.name}</span>
                                                {player.isJoinLeague && (
                                                    <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold">
                                                        리그참가
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {player.age} • {player.grade}조
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
