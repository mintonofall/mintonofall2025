"use client";

/**
 * @file /app/diary/[clubid]/page.tsx
 * @description 경기 결과를 수동으로 기록하는 페이지 컴포넌트입니다.
 * URL에서 클럽 ID를 파라미터로 받아 해당 클럽의 선수 목록을 표시하고,
 * 4명의 선수를 선택하여 경기 결과를 입력하고 저장하는 기능을 제공합니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useEffect, useRef, useState } from "react";
import {
    getPlayersFromClub,
    getWinToday,
    makeMatch,
    getOrCreateClubDiary,
    getMatch,
    deleteMatch,
    updateMatchScore,
} from "@/lib/getClubDiary";
import { PlayerDiary } from "@/lib/interface";
import type { MatchDiaryWithPlayers } from "@/lib/types";
import ScoreInput from "@/app/component/ScoreInput";
// import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline"; // ScoreInput으로 이동
import getSessionClient from "@/lib/sessionClient";
import Link from "next/link";
export default function Diary({ params }: { params: Promise<{ userid: number }> }) {
    // --- 상태 관리 (State Management) ---
    /** @type {PlayerDiary[]} 대기 선수 목록. 경기에 참여할 수 있는 전체 선수 리스트입니다. */
    const [waitPlayerList, setWaitPlayerList] = useState<PlayerDiary[]>([]);
    const [firstWaitPlayerList, setFirstWaitPlayerList] = useState<PlayerDiary[]>([]);
    /** @type {number} 현재 로그인된 사용자의 ID. */
    const [userid, setUserid] = useState(0);
    /** @type {number} 현재 페이지의 클럽 ID. */
    const [, setClubId] = useState(0);
    /** @type {PlayerDiary[]} 현재 경기에 선택된 선수 목록 (최대 4명). */
    const [playerList, setPlayerList] = useState<PlayerDiary[]>([]);
    const [score1, setScore1] = useState<number>(25); // ScoreInput으로 이동
    const [score2, setScore2] = useState<number>(25); // ScoreInput으로 이동
    /** @type {string} 선수 검색어. */
    const [searchTerm, setSearchTerm] = useState("");
    /** @type {"recent" | "name" | "record"} 선수 목록 정렬 기준. */
    const [sortCriteria, setSortCriteria] = useState<"recent" | "name" | "record">("recent");
    const [data, setData] = useState<number[]>([0, 0, 0, 0]);
    /** @type {number | null} 현재 사용자가 소유한 ClubDiary의 실제 ID (경기 기록 생성 시 연결에 사용). */
    const [clubDiaryId, setClubDiaryId] = useState<number | null>(null);
    /** @type {MatchDiaryWithPlayers[]} 나와의 상대전적을 계산하기 위한 전체 경기 기록. */
    const [allMatches, setAllMatches] = useState<MatchDiaryWithPlayers[]>([]);
    /** sessionStorage 복원이 끝나기 전까지는 저장 effect가 빈 상태로 덮어쓰지 않도록 막는 플래그. */
    const hasRestoredRef = useRef(false);
    /** @type {boolean} 경기 결과 저장 중 여부. 중복 제출을 막기 위해 '결과입력' 버튼을 비활성화하는 데 사용합니다. */
    const [isSubmitting, setIsSubmitting] = useState(false);
    /** @type {number | null} '오늘 기록' 목록에서 현재 점수를 수정 중인 경기의 ID. */
    const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
    const [editScore1, setEditScore1] = useState(0);
    const [editScore2, setEditScore2] = useState(0);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // --- 데이터 로딩 및 초기화 (Data Loading & Initialization) ---

    /**
     * 컴포넌트 마운트 시 URL 파라미터와 세션 정보를 가져와 상태를 설정합니다.
     */
    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).userid;
            const session = await getSessionClient();
            setUserid(Number(session!.id));
            setClubId(Number(resolvedParams));
        }
        fetchParams();
    }, [params]);

    /**
     * userid가 설정되면 해당 클럽의 선수 목록을 불러옵니다.
     */
    useEffect(() => {
        async function fetchPlayers() {
            if (userid === 0) return; // clubid가 설정될 때까지 API 호출을 방지합니다.
            const players = await getPlayersFromClub(userid);
            console.log("userid : ", userid);
            setWaitPlayerList(players);
            setFirstWaitPlayerList(players);
            const datas = await getWinToday(userid);
            setData(datas);

            // 경기 기록을 생성할 때 연결할 실제 ClubDiary ID를 가져옵니다 (없으면 자동 생성).
            const clubDiary = await getOrCreateClubDiary(userid);
            setClubDiaryId(clubDiary.id);

            // 나와의 상대전적을 계산하기 위해 전체 경기 기록을 가져옵니다.
            const matches = await getMatch(userid);
            setAllMatches(matches);
        }
        fetchPlayers();
    }, [userid]);

    /**
     * 선수추가 등으로 다른 페이지에 다녀와도 입력 중이던 경기(선택한 선수, 점수)가 초기화되지
     * 않도록, userid가 설정되면 sessionStorage에서 복원합니다.
     */
    useEffect(() => {
        if (userid === 0) return;
        try {
            const saved = sessionStorage.getItem(`diary-match-${userid}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed.playerList)) setPlayerList(parsed.playerList);
                if (typeof parsed.score1 === "number") setScore1(parsed.score1);
                if (typeof parsed.score2 === "number") setScore2(parsed.score2);
            }
        } catch (error) {
            console.error("입력 중이던 경기 정보를 복원하는 중 오류가 발생했습니다:", error);
        } finally {
            // 복원이 끝난 뒤에만 저장 effect가 동작하도록 허용합니다 (복원 전 빈 상태로 덮어쓰는 것을 방지).
            hasRestoredRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userid]);

    /**
     * 선택한 선수나 점수가 바뀔 때마다 sessionStorage에 저장해, 다른 페이지에 다녀와도
     * 입력 중이던 경기가 유지되게 합니다.
     */
    useEffect(() => {
        if (userid === 0 || !hasRestoredRef.current) return;
        sessionStorage.setItem(`diary-match-${userid}`, JSON.stringify({ playerList, score1, score2 }));
    }, [userid, playerList, score1, score2]);

    /** @type {PlayerDiary | undefined} "주인공"(나)으로 지정된 선수. */
    const me = firstWaitPlayerList.find((p) => p.isMe);

    /**
     * 나와 특정 선수가 서로 다른 팀(상대)으로 맞붙은 경기만 집계하여 상대전적을 계산합니다.
     * @param {number} opponentId - 상대전적을 계산할 선수의 ID
     * @returns {{ wins: number; losses: number }} 나의 승/패 횟수
     */
    function getHeadToHeadRecord(opponentId: number): { wins: number; losses: number } {
        if (!me) return { wins: 0, losses: 0 };
        let wins = 0;
        let losses = 0;
        allMatches.forEach((match) => {
            const team1 = [match.players[0]?.id, match.players[1]?.id];
            const team2 = [match.players[2]?.id, match.players[3]?.id];
            const meVsOpponent =
                (team1.includes(me.id) && team2.includes(opponentId)) ||
                (team2.includes(me.id) && team1.includes(opponentId));
            if (!meVsOpponent) return;

            if (match.winner1id === me.id || match.winner2id === me.id) {
                wins += 1;
            } else if (match.winner1id === opponentId || match.winner2id === opponentId) {
                losses += 1;
            }
        });
        return { wins, losses };
    }

    /**
     * 나와 특정 선수가 같은 팀(파트너)으로 함께한 경기 횟수를 계산합니다.
     * @param {number} partnerId - 파트너 횟수를 계산할 선수의 ID
     * @returns {number} 나와 파트너로 함께한 경기 횟수
     */
    function getPartnerCount(partnerId: number): number {
        if (!me) return 0;
        return allMatches.filter((match) => {
            const team1 = [match.players[0]?.id, match.players[1]?.id];
            const team2 = [match.players[2]?.id, match.players[3]?.id];
            return (
                (team1.includes(me.id) && team1.includes(partnerId)) ||
                (team2.includes(me.id) && team2.includes(partnerId))
            );
        }).length;
    }

    /**
     * 선수 목록을 정렬 기준에 맞게 정렬합니다.
     * - 최근: 마지막 경기 시간이 최신인 선수부터
     * - 이름: 가나다순
     * - 전적: 나와의 상대전적(승+패) 경기가 많은 선수부터, 같으면 전적이 좋은 선수부터
     * @param {PlayerDiary[]} list - 정렬할 선수 목록
     * @returns {PlayerDiary[]} 정렬된 선수 목록
     */
    function sortPlayers(list: PlayerDiary[]): PlayerDiary[] {
        // 주인공(나)은 정렬 기준과 무관하게 항상 맨 위에 둡니다.
        const mine = list.filter((p) => me && p.id === me.id);
        const others = list.filter((p) => !me || p.id !== me.id);

        if (sortCriteria === "name") {
            others.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        } else if (sortCriteria === "record") {
            others.sort((a, b) => {
                const ra = getHeadToHeadRecord(a.id);
                const rb = getHeadToHeadRecord(b.id);
                const gamesA = ra.wins + ra.losses;
                const gamesB = rb.wins + rb.losses;
                if (gamesB !== gamesA) return gamesB - gamesA;
                return rb.wins - rb.losses - (ra.wins - ra.losses);
            });
        } else {
            // 최근 (기본값)
            others.sort((a, b) => (b.lastGameDate?.getTime() ?? 0) - (a.lastGameDate?.getTime() ?? 0));
        }

        return [...mine, ...others];
    }

    // --- 이벤트 핸들러 (Event Handlers) ---

    /**
     * 대기 목록에서 선수를 클릭했을 때, 경기 선수 목록에 추가합니다.
     * @param {PlayerDiary} player - 클릭된 선수 객체
     */
    function handleClickedPlayer(player: PlayerDiary) {
        console.log("Clicked player:", player);
        if (playerList.length >= 4) return;

        // 경기 선수 목록에 추가
        const playerListCopy = [...playerList];
        playerListCopy.push(player);
        setPlayerList(playerListCopy);

        // [Optimistic Update]
        // 대기 선수 목록에서 lastGameDate를 현재 시간으로 낙관적 업데이트합니다.
        // 이를 통해 UI에서 선수의 마지막 경기 시간을 즉시 반영할 수 있습니다.
        const updatedList = firstWaitPlayerList.map((p) =>
            p.id === player.id ? { ...p, lastGameDate: new Date() } : p,
        );
        setFirstWaitPlayerList(updatedList);

        // 선수를 선택하면 검색어와 검색 결과를 초기화해 전체 목록으로 되돌립니다.
        setSearchTerm("");
        setWaitPlayerList(updatedList);
    }

    /**
     * 경기 결과를 제출하고 데이터베이스에 저장하는 함수입니다.
     * 선택된 선수, 점수, 클럽 ID 등을 사용하여 경기 결과를 생성합니다.
     */
    async function handleSubmitMatch() {
        // userid와 clubDiaryId가 유효한지 확인합니다.
        if (!userid || !clubDiaryId) {
            alert("사용자 또는 클럽 정보가 아직 로드되지 않았습니다.");
            return;
        }

        // 필수 선수 4명이 모두 선택되었는지 확인
        if (playerList.length !== 4) {
            alert("경기를 기록하려면 4명의 선수를 선택해야 합니다.");
            return;
        }

        // 무승부 방지
        if (score1 === score2) {
            alert("무승부는 입력할 수 없습니다.");
            return;
        }

        if (isSubmitting) return;

        let winner1: number | undefined;
        let winner2: number | undefined;

        // 승자 결정 로직
        if (score1 > score2) {
            winner1 = playerList[0].id;
            winner2 = playerList[1].id;
        } else {
            // score1 < score2
            winner1 = playerList[2].id;
            winner2 = playerList[3].id;
        }

        // makeMatch 함수 호출 (비동기)
        // playerList의 모든 id를 배열로 전달
        const allPlayerIds = playerList.map((p) => p.id);

        console.log("Submitting match with:", {
            allPlayerIds,
            userid,
            clubid: clubDiaryId,
            winner1,
            winner2,
            score1,
            score2,
        });

        setIsSubmitting(true);
        try {
            const result = await makeMatch(allPlayerIds, userid, clubDiaryId, winner1, winner2, score1, score2);
            console.log("Match submission result:", result);

            // allPlayerIds의 숫자를 waitPlayerList의 id와 매치하여 lastGameDate에 현재시간을 입력함
            setWaitPlayerList((currentWaitList) =>
                currentWaitList
                    .map((p) => (allPlayerIds.includes(p.id) ? { ...p, lastGameDate: new Date() } : p))
                    .sort((a, b) => (b.lastGameDate?.getTime() || 0) - (a.lastGameDate?.getTime() || 0)),
            );

            const datas = await getWinToday(userid);
            setData(datas);

            // 나와의 상대전적에 방금 기록한 경기가 반영되도록 다시 불러옵니다.
            const matches = await getMatch(userid);
            setAllMatches(matches);

            // 상태 초기화
            setPlayerList([]);
            setScore1(25);
            setScore2(25);
            setSearchTerm("");
            setWaitPlayerList(firstWaitPlayerList); // 검색 필터 및 선수 목록 초기화
            sessionStorage.removeItem(`diary-match-${userid}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    /**
     * 경기 기록을 삭제합니다. 잘못 입력한 결과를 언제든 지울 수 있게 합니다.
     * @param {number} matchId - 삭제할 경기(MatchDiary)의 ID
     */
    async function handleDeleteMatch(matchId: number) {
        if (!confirm("이 경기 기록을 삭제할까요?")) return;
        await deleteMatch(matchId);
        setAllMatches((prev) => prev.filter((m) => m.id !== matchId));
        const datas = await getWinToday(userid);
        setData(datas);
    }

    /**
     * '오늘 기록' 목록에서 점수 수정을 시작합니다. 경기 기록은 지우지 않고,
     * 점수 칸만 그 자리에서 입력창으로 바꿔 수정할 수 있게 합니다.
     * @param {MatchDiaryWithPlayers} match - 수정할 경기 기록
     */
    function startEditMatch(match: MatchDiaryWithPlayers) {
        setEditingMatchId(match.id);
        setEditScore1(match.score1 ?? 25);
        setEditScore2(match.score2 ?? 25);
    }

    /**
     * 수정한 점수를 저장합니다. 더 높은 점수를 받은 팀을 승자로 다시 계산해서 반영합니다.
     * 팀 편성(선수 구성)은 그대로 둡니다.
     * @param {MatchDiaryWithPlayers} match - 수정 중인 경기 기록
     */
    async function handleSaveEditMatch(match: MatchDiaryWithPlayers) {
        if (editScore1 === editScore2) {
            alert("무승부는 입력할 수 없습니다.");
            return;
        }

        const team1Won = editScore1 > editScore2;
        const winner1id = (team1Won ? match.players[0]?.id : match.players[2]?.id) ?? null;
        const winner2id = (team1Won ? match.players[1]?.id : match.players[3]?.id) ?? null;

        setIsSavingEdit(true);
        try {
            await updateMatchScore(match.id, editScore1, editScore2, winner1id, winner2id);
            setAllMatches((prev) =>
                prev.map((m) =>
                    m.id === match.id
                        ? { ...m, score1: editScore1, score2: editScore2, winner1id, winner2id }
                        : m,
                ),
            );
            const datas = await getWinToday(userid);
            setData(datas);
            setEditingMatchId(null);
        } finally {
            setIsSavingEdit(false);
        }
    }

    /** @type {MatchDiaryWithPlayers[]} 오늘 기록된 경기만 모아, 수정/삭제 목록에 보여줍니다. */
    const todayMatches = allMatches
        .filter((match) => new Date(match.startTime).toDateString() === new Date().toDateString())
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return (
        // --- 렌더링 (Rendering) ---
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-3 text-center shrink-0">게임 결과 입력</h1>
            <div className="flex flex-1 min-h-0 flex-row gap-4 justify-center">
                <div className="flex flex-col w-1/2 p-4 bg-white shadow-md rounded-lg overflow-y-auto">
                    <div className="mb-2">
                        <h2 className="text-xl font-semibold">Player 1</h2>
                        <div className="text-gray-700">{playerList[0] ? playerList[0].name : "No player selected"}</div>
                    </div>
                    <div className="mb-2">
                        <h2 className="text-xl font-semibold">Player 2</h2>
                        <div className="text-gray-700">{playerList[1] ? playerList[1].name : "No player selected"}</div>
                    </div>
                    {/* 점수 입력 컴포넌트 */}
                    <ScoreInput score1={score1} setScore1={setScore1} score2={score2} setScore2={setScore2} />
                    <div className="mb-2">
                        <h2 className="text-xl font-semibold">Player 3</h2>
                        <div className="text-gray-700">{playerList[2] ? playerList[2].name : "No player selected"}</div>
                    </div>
                    <div className="mb-2">
                        <h2 className="text-xl font-semibold">Player 4</h2>
                        <div className="text-gray-700">{playerList[3] ? playerList[3].name : "No player selected"}</div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            /**
                             * '결과입력' 버튼 클릭 핸들러.
                             * 선수 4명이 모두 선택되었는지 확인하고, 승자를 결정한 후 `makeMatch` API를 호출하여 경기 결과를 저장합니다.
                             */
                            onClick={handleSubmitMatch}
                            disabled={isSubmitting}
                            className="mt-4 px-7 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "저장 중..." : "결과입력"}
                        </button>
                        <button
                            /**
                             * 'UNDO' 버튼 클릭 핸들러.
                             * 마지막으로 선택된 선수를 경기 목록에서 제거합니다.
                             */
                            onClick={() => {
                                const copy = [...playerList];
                                copy.pop();
                                setPlayerList(copy);
                            }}
                            className="mt-4 px-1 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            UNDO
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-1/2 p-4 bg-gray-100 shadow-md rounded-lg overflow-y-auto">
                    <Link
                        className="sticky top-0 z-10 block"
                        href={{
                            pathname: `/diary/${userid}/create`,
                            query: { userid: userid },
                        }}
                    >
                        <span className="block w-full text-center lg:text-lg text-lg py-2 px-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                            선수추가
                        </span>
                    </Link>
                    <input
                        className="p-2 m-2"
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={searchTerm}
                        onChange={(e) => {
                            const term = e.target.value;
                            setSearchTerm(term);
                            if (term === "") {
                                setWaitPlayerList(firstWaitPlayerList);
                            } else {
                                const filteredPlayers = firstWaitPlayerList.filter((player) =>
                                    player.name.includes(term),
                                );
                                setWaitPlayerList(filteredPlayers);
                            }
                        }}
                    ></input>
                    <div className="flex gap-1 px-2 pb-2">
                        {(
                            [
                                { key: "recent", label: "최근" },
                                { key: "name", label: "이름" },
                                { key: "record", label: "전적" },
                            ] as const
                        ).map((option) => (
                            <button
                                key={option.key}
                                onClick={() => setSortCriteria(option.key)}
                                className={`text-xs px-2 py-1 rounded ${
                                    sortCriteria === option.key
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    {sortPlayers(waitPlayerList).map((player) => {
                        const isMePlayer = me?.id === player.id;
                        const record = !isMePlayer ? getHeadToHeadRecord(player.id) : null;
                        const partnerCount = !isMePlayer ? getPartnerCount(player.id) : null;
                        return (
                            <div
                                className="p-2 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200"
                                onClick={() => handleClickedPlayer(player)}
                                key={player.id}
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <h1 className="text-lg font-semibold truncate min-w-0">{player.name}</h1>
                                    {isMePlayer && (
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold shrink-0 whitespace-nowrap">
                                            주인공
                                        </span>
                                    )}
                                    {record && (
                                        <span className="text-xs font-semibold text-gray-500 shrink-0 whitespace-nowrap">
                                            {record.wins + record.losses > 0
                                                ? `${record.wins}승 ${record.losses}패`
                                                : ""}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <div className="flex gap-2">
                                        <h2 className="text-sm text-gray-600">{player.age} </h2>
                                        <h2 className="text-sm text-gray-600">{player.grade}</h2>
                                    </div>
                                    {partnerCount !== null && partnerCount > 0 && (
                                        <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                                            파트너 {partnerCount}회
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {todayMatches.length > 0 && (
                <div className="shrink-0 border-t max-h-40 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-600 px-2 pt-2">오늘 기록 (수정·삭제 가능)</h3>
                    {todayMatches.map((match) => {
                        const [p0, p1, p2, p3] = match.players;
                        const isEditing = editingMatchId === match.id;
                        return (
                            <div
                                key={match.id}
                                className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm border-b last:border-b-0"
                            >
                                <span className="truncate flex items-center gap-1">
                                    {p0?.name}·{p1?.name} <b className="text-gray-400">vs</b> {p2?.name}·{p3?.name}
                                    {isEditing ? (
                                        <span className="flex items-center gap-1 ml-1">
                                            (
                                            <input
                                                type="number"
                                                value={editScore1}
                                                onChange={(e) => setEditScore1(Number(e.target.value))}
                                                className="w-12 text-center border border-gray-300 rounded"
                                            />
                                            :
                                            <input
                                                type="number"
                                                value={editScore2}
                                                onChange={(e) => setEditScore2(Number(e.target.value))}
                                                className="w-12 text-center border border-gray-300 rounded"
                                            />
                                            )
                                        </span>
                                    ) : (
                                        match.score1 != null &&
                                        match.score2 != null && (
                                            <span className="text-gray-500 ml-1">
                                                ({match.score1}:{match.score2})
                                            </span>
                                        )
                                    )}
                                </span>
                                <span className="flex gap-1 shrink-0">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => handleSaveEditMatch(match)}
                                                disabled={isSavingEdit}
                                                className="text-xs px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                                            >
                                                {isSavingEdit ? "저장 중..." : "저장"}
                                            </button>
                                            <button
                                                onClick={() => setEditingMatchId(null)}
                                                disabled={isSavingEdit}
                                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                            >
                                                취소
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEditMatch(match)}
                                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMatch(match.id)}
                                                className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="shrink-0 text-center py-2">
                오늘 결과 {data[0]}승 {data[1]}패 {data[2]}득점 {data[3]}실점
            </div>
        </div>
    );
}
