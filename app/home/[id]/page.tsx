"use client";

/**
 * @file /app/home/[id]/page.tsx
 * @description 클럽의 메인 대시보드 페이지입니다. 코트 현황, 대기열, 선수 목록 등을 관리합니다.
 * @author Treebird
 * @date 2024-07-16
 */
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
    getMatchs,
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

/**
 * 한글 초성을 추출하기 위한 배열
 */
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

/**
 * 문자열에서 초성을 추출하는 함수
 * @param {string} str - 초성을 추출할 문자열
 * @returns {string} 추출된 초성 문자열
 */
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

/**
 * 클럽의 메인 대시보드 페이지 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {Promise<{ id: string }>} props.params - URL 파라미터로 전달된 클럽 ID
 */
export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
    // --- 상태 관리 (State Management) ---

    /** @type {any[]} 클럽에 등록된 전체 선수 목록 */
    const [players, setPlayers] = useState<any[]>([]);
    /** @type {boolean} 전체 선수 목록 팝업 표시 여부 */
    const [showPlayerList, setShowPlayerList] = useState(false);
    /** @type {string} 전체 선수 목록 검색어 */
    const [searchTerm, setSearchTerm] = useState("");
    /** @type {any[]} 현재 입장한 대기 선수 목록 */
    const [waitPlayerList, setWaitPlayerList] = useState<any[]>([]);
    /** @type {boolean} 데이터 로딩 상태 */
    const [isLoading, setIsLoading] = useState(true);
    /** @type {number | null} 대기 게임판에서 선택된 셀의 인덱스 */
    const [selectedCell, setSelectedCell] = useState<number | null>(1);
    /** @type {(any | null)[]} 35칸의 대기 게임판 데이터. 각 셀에는 선수 정보 또는 null이 저장됩니다. */
    const [gridData, setGridData] = useState<(any | null)[]>(Array(35).fill(null));
    /** @type {number} 클럽의 총 코트 수 */
    const [howManyCourts, setHowManyCourts] = useState<number>(0);
    /** @type {number} 다음 게임이 배정될 코트 인덱스 (0-based) */
    const [courtPointer, setCourtPointer] = useState<number>(0);
    /** @type {any[]} 현재 게임이 진행 중인 코트 목록 */
    const [courts, setCourts] = useState<any[]>([]);
    /** @type {any[]} 클럽의 모든 경기 기록 */
    const [matches, setMatches] = useState<any[]>([]);
    /** @type {string} 대기 명단 정렬 기준 */
    const [sortCriteria, setSortCriteria] = useState("enterTime");
    /** @type {"asc" | "desc"} 대기 명단 정렬 방향 */
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    /** @deprecated 현재 사용되지 않는 상태 */
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    /** @type {{ isOpen: boolean; courtIndex: number | null }} 경기 결과 입력 모달 상태 */
    const [gameResultModal, setGameResultModal] = useState<{ isOpen: boolean; courtIndex: number | null }>({
        isOpen: false,
        courtIndex: null,
    });
    /** @type {{ isOpen: boolean; player: any | null }} 선수 정보 수정 모달 상태 */
    const [editModal, setEditModal] = useState<{ isOpen: boolean; player: any | null }>({
        isOpen: false,
        player: null,
    });
    /** @type {{ isOpen: boolean; player: any | null }} 선수 경기 기록 모달 상태 */
    const [historyModal, setHistoryModal] = useState<{ isOpen: boolean; player: any | null }>({
        isOpen: false,
        player: null,
    });
    /** @type {boolean} 신규 선수 추가 모달 상태 */
    const [addModalOpen, setAddModalOpen] = useState(false);
    /** @type {number} 현재 클럽 ID */
    const [clubId, setClubId] = useState<number>(0);

    // --- 데이터 로딩 및 초기화 (Data Loading & Initialization) ---

    /**
     * 컴포넌트 마운트 시 URL 파라미터에서 클럽 ID를 추출하여 상태에 설정합니다.
     */
    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            setClubId(Number(resolvedParams.id));
        };
        getParams();
    }, [params]);

    /**
     * clubId가 설정되면 서버로부터 클럽의 모든 데이터를 가져와 상태를 초기화합니다.
     * (클럽 정보, 선수 목록, 대기열, 코트 현황 등)
     */
    const fetchData = async () => {
        if (!clubId) return;
        console.log("fetched data");

        // 병렬로 데이터 가져오기
        const data = await getClub(clubId);
        const matchData = await getMatchs(clubId);
        setMatches(Array.isArray(matchData) ? matchData : []);

        // 클럽 기본 정보 설정
        setHowManyCourts(data?.howManyCourts || 0);
        const latestPlayers = data?.players || [];
        setPlayers(latestPlayers);

        // 대기 선수 목록 및 대기 게임판 정보 가져오기
        const waitData = await getWaitPlayerList(clubId);
        const waitGameData = await getWaitGames(clubId);

        setWaitPlayerList(
            waitData.map((item) => {
                const gameData = waitGameData?.find((g: any) => g.playerid === item.Playerid);
                return { ...item.player, clickedTime: gameData ? gameData.updateTime : item.enterDate };
            }),
        );

        // 대기 게임판(gridData) 상태 설정
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

        // 코트(courts) 상태 설정
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

        // 다음 게임이 들어갈 코트(courtPointer)와 선택될 셀(selectedCell)의 초기 위치 계산
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
    }, [clubId]);

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

    // --- 이벤트 핸들러 (Event Handlers) ---

    /**
     * 대기 명단에서 선수를 퇴장시키는 핸들러
     * @param {number} playerId - 퇴장시킬 선수의 ID
     */
    const handleExit = async (playerId: number) => {
        setWaitPlayerList((prev) => prev.filter((p) => p.id !== playerId));
        await exitPlayer(playerId, clubId);
    };

    /**
     * 대기 명단의 정렬 기준을 변경하는 핸들러
     * @param {string} criteria - 정렬 기준 ('name', 'grade', 'games', 'participating', 'enterTime')
     */
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

    /**
     * 선수의 오늘 경기 수를 계산하는 헬퍼 함수
     * @param {any[]} gameDatas - 선수의 경기 기록 날짜 배열
     * @returns {number} 오늘 진행한 경기 수
     */
    const getTodayGameCount = (gameDatas: any[]) => {
        if (!gameDatas || !Array.isArray(gameDatas)) return 0;
        const today = new Date().toDateString();
        return gameDatas.filter((date) => new Date(date).toDateString() === today).length;
    };

    /**
     * 정렬 기준에 따라 대기 명단을 정렬합니다.
     * useMemo를 사용하여 waitPlayerList, sortCriteria, sortDirection이 변경될 때만 재계산합니다.
     * @returns {any[]} 정렬된 대기 선수 목록
     */
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

    /**
     * 대기 명단(RightSection)에서 선수를 클릭했을 때, 대기 게임판(LeftBottomSection)에 추가하는 핸들러
     * @param {any} player - 선택된 선수 정보
     */
    const handlePlayerSelect = async (player: any) => {
        if (selectedCell === null) return;

        const updatedPlayer = {
            ...player,
            isSaved: false,
        };

        // 그리드 데이터에 선수 추가
        const newGridData = [...gridData];
        newGridData[selectedCell] = updatedPlayer;
        setGridData(newGridData);

        // 대기 명단에서 선수의 클릭 시간을 업데이트하여 순서를 조정
        setWaitPlayerList((prev) => {
            const newList = prev.filter((p) => p.id !== player.id);
            return [...newList, { ...player, clickedTime: new Date() }];
        });

        // 다음 비어있는 셀을 찾아 selectedCell로 설정
        let nextCell = selectedCell + 1; // 현재 셀 다음부터 탐색 시작
        while (nextCell < 35 && (nextCell % 5 === 0 || newGridData[nextCell])) {
            nextCell++;
        }

        if (nextCell < 35) {
            setSelectedCell(nextCell);
        } else {
            // 끝까지 탐색했는데 빈 셀이 없으면 처음부터 다시 탐색
            let nextEmpty = 1;
            while (nextEmpty < 35 && (nextEmpty % 5 === 0 || newGridData[nextEmpty])) {
                nextEmpty++;
            }
            setSelectedCell(nextEmpty < 35 ? nextEmpty : 1);
        }

        const waitGameList = newGridData
            .map((p, index) => (p ? { point: index, playerid: p.id, clubid: clubId } : null))
            .filter((p) => p !== null);
        // DB에 현재 대기 게임판 상태 저장
        await resetWaitGames(clubId, waitGameList);

        setGridData((prev) => {
            const newData = [...prev];
            // DB 저장 후 isSaved 상태를 true로 변경 (UI에서 삭제 버튼 표시용)
            if (newData[selectedCell]) {
                newData[selectedCell] = { ...newData[selectedCell], isSaved: true };
            }
            return newData;
        });
    };

    /**
     * '게임 시작' 버튼 클릭 핸들러
     * @param {number} startIndex - 게임을 시작할 행의 시작 인덱스 (0, 5, 10, ...)
     */
    const handleGameStart = async (startIndex: number) => {
        const p1 = gridData[startIndex + 1];
        const p2 = gridData[startIndex + 2];
        const p3 = gridData[startIndex + 3];
        const p4 = gridData[startIndex + 4];

        if (!p1 || !p2 || !p3 || !p4) {
            alert("4명을 채워주세요");
            return;
        }

        // 게임에 참여할 선수들이 이미 다른 코트에서 게임 중인지 확인
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

        // 목표 코트가 비어있는지 확인
        if (courts[courtPointer]) {
            alert("해당 코트가 비어있지 않습니다.");
            return;
        }

        // 고유한 게임 ID 생성
        const gameId =
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                      const r = (Math.random() * 16) | 0;
                      const v = c === "x" ? r : (r & 0x3) | 0x8;
                      return v.toString(16);
                  });
        const targetCourtIndex = courtPointer;

        // UI를 먼저 업데이트 (Optimistic Update)
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

        // 게임 시작한 선수들을 대기 게임판에서 제거하고 재정렬
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

        // 다음 선택될 셀을 첫 번째 빈 칸으로 설정
        let firstEmptyIndex = 0;
        while (firstEmptyIndex < 35 && (firstEmptyIndex % 5 === 0 || newGridData[firstEmptyIndex])) {
            firstEmptyIndex++;
        }
        setSelectedCell(firstEmptyIndex < 35 ? firstEmptyIndex : null);

        try {
            // DB에 경기 생성 및 시작 정보 기록
            await createMatch(gameId, clubId, p1.id, p2.id, p3.id, p4.id, []);
            await startMatch(clubId, p1.id, p2.id, p3.id, p4.id, targetCourtIndex + 1, gameId);

            const playerIds = [p1.id, p2.id, p3.id, p4.id];
            await Promise.all(playerIds.map((id) => gameOneUp(id)));

            // 로컬 상태(선수 경기 수) 업데이트
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

            // 변경된 대기 게임판 정보를 DB에 저장
            const waitGameList = newGridData
                .map((p, index) => (p ? { point: index, playerid: p.id, clubid: clubId } : null))
                .filter((p) => p !== null);
            await resetWaitGames(clubId, waitGameList);
            // DB 작업 완료 후 로딩 상태 해제
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

    /**
     * 대기 게임판에서 선수를 제거하는 핸들러
     * @param {number} index - 제거할 선수가 있는 셀의 인덱스
     */
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

    /**
     * '경기 종료' 버튼 클릭 시 결과 입력 모달을 여는 핸들러
     * @param {number} index - 종료할 경기가 있는 코트의 인덱스
     */
    const handleGameEnd = (index: number) => {
        setGameResultModal({ isOpen: true, courtIndex: index });
    };

    /**
     * 진행 중인 경기를 취소하는 핸들러
     * @param {number} index - 취소할 경기가 있는 코트의 인덱스
     */
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

    /**
     * 경기 결과 모달에서 승자를 확정하는 핸들러
     * @param {string[]} winnersKey - 승리한 선수의 키 배열 (e.g., ['p1', 'p3'])
     */
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

    /**
     * 선수 정보 수정 모달에서 정보를 저장하는 핸들러
     * @param {any} updatedPlayer - 수정된 선수 정보
     */
    const handleUpdatePlayer = async (updatedPlayer: any) => {
        await updatePlayer(updatedPlayer);
        setEditModal({ isOpen: false, player: null });
        fetchData();
    };

    /**
     * 선수의 경기 기록을 보는 모달을 여는 핸들러
     * @param {any} player - 기록을 볼 선수 정보
     */
    const handleHistoryClick = (player: any) => {
        setHistoryModal({ isOpen: true, player });
    };

    /**
     * 신규 선수를 생성하는 핸들러
     * @param {any} newPlayer - 생성할 선수 정보
     */
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

    /**
     * 특정 셀 인덱스가 속한 행의 4개 플레이어 셀 인덱스를 반환하는 함수
     * @param {number | null} index - 기준 셀 인덱스
     * @returns {number[]} 같은 행에 속한 4개 셀의 인덱스 배열
     */
    const getRowCells = (index: number | null) => {
        if (index === null) return [];
        const start = Math.floor(index / 5) * 5 + 1;
        return [start, start + 1, start + 2, start + 3];
    };

    /**
     * 특정 셀 인덱스가 속한 행의 선수들 이름을 문자열로 반환하는 함수
     * @param {number | null} index - 기준 셀 인덱스
     * @returns {string} 쉼표로 구분된 선수 이름 문자열
     */
    const getRowPlayerNames = (index: number | null) => {
        if (index === null) return "없음";
        const rowCellIndices = getRowCells(index);
        const playerNames = rowCellIndices
            .map((cellIndex) => gridData[cellIndex]?.name)
            .filter((name) => name)
            .join(", ");
        return playerNames || "없음";
    };

    const getRowPlayerIds = (index: number | null) => {
        if (index === null) return "없음";
        const rowCellIndices = getRowCells(index);
        const playerIds = rowCellIndices
            .map((cellIndex) => gridData[cellIndex]?.id)
            .filter((id) => id !== undefined && id !== null)
            .join(", ");
        return playerIds || "없음";
    };

    const getRowMatchIds = (index: number | null) => {
        if (index === null) return "없음";
        const rowCellIndices = getRowCells(index);
        const rowPlayers = rowCellIndices.map((i) => gridData[i]).filter((p) => p);

        if (rowPlayers.length === 0) return "선수 없음";

        const rowPlayerIds = rowPlayers.map((p) => p.id);
        const matchingMatches = matches.filter((match: any) => {
            const matchPlayerIds = [match.player1id, match.player2id, match.player3id, match.player4id].filter(
                (id) => id,
            );
            // 선택된 행의 모든 선수가 해당 경기에 포함되어 있는지 확인
            return rowPlayerIds.every((rowPlayerId) => matchPlayerIds.includes(rowPlayerId));
        });

        if (matchingMatches.length === 0) return "없음";
        return matchingMatches
            .map((m: any) => {
                const names = [m.player1id, m.player2id, m.player3id, m.player4id]
                    .map((id) => players.find((p) => p.id === id)?.name ?? "?")
                    .join(",");
                return `[${names}]`;
            })
            .join(", ");
    };

    /**
     * 로딩 중일 때 로딩 컴포넌트를 표시합니다.
     */
    if (isLoading) {
        return <Loading />;
    }

    let displayInfoCell = selectedCell;
    if (selectedCell !== null) {
        const rowIndices = getRowCells(selectedCell);
        const hasPlayers = rowIndices.some((idx) => gridData[idx]);
        if (!hasPlayers && selectedCell >= 5) {
            displayInfoCell = selectedCell - 5;
        }
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
                <div className="flex items-center justify-center p-2 bg-gray-100 border rounded-md text-sm text-gray-700 shadow-sm">
                    {displayInfoCell !== null ? <span>{getRowMatchIds(displayInfoCell)}</span> : "선택된 셀 없음"}
                </div>
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
                                                    src={
                                                        player.avater?.startsWith("https://imagedelivery.net/")
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
