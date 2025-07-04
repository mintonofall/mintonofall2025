"use client";

import { useEffect, useState } from "react";
import { getPlayersFromClub, makeMatch } from "@/lib/getClubDiary";
import { PlayerDiary } from "@/lib/interface";
import ScoreInput from "@/app/component/ScoreInput";
// import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline"; // ScoreInput으로 이동
import getSessionClient from "@/lib/sessionClient";
import Link from "next/link";
/**
 * 경기 결과를 기록하는 다이어리 페이지 컴포넌트입니다.
 * URL에서 clubid를 파라미터로 받아 해당 클럽의 선수 목록을 표시하고,
 * 경기 결과를 입력하고 저장하는 기능을 제공합니다.
 * @param {object} params - 페이지 파라미터
 * @param {Promise<{ clubid: number }>} params.params - 클럽 ID를 포함하는 Promise 객체
 */
export default function Diary({ params }: { params: Promise<{ clubid: number }> }) {
    // --- 상태 관리 (State Management) ---
    /** @type {PlayerDiary[]} 대기 선수 목록. 경기에 참여할 수 있는 전체 선수 리스트입니다. */
    const [waitPlayerList, setWaitPlayerList] = useState<PlayerDiary[]>([]);
    const [firstWaitPlayerList, setFirstWaitPlayerList] = useState<PlayerDiary[]>([]);
    /** @type {number} 현재 로그인된 사용자의 ID. */
    const [userid, setUserid] = useState(0);
    /** @type {number} 현재 페이지의 클럽 ID. */
    const [clubid, setClubId] = useState(0);
    /** @type {PlayerDiary[]} 현재 경기에 선택된 선수 목록 (최대 4명). */
    const [playerList, setPlayerList] = useState<PlayerDiary[]>([]);
    const [score1, setScore1] = useState<number>(25); // ScoreInput으로 이동
    const [score2, setScore2] = useState<number>(25); // ScoreInput으로 이동

    // --- 데이터 로딩 및 초기화 (Data Loading & Initialization) ---

    /**
     * 컴포넌트 마운트 시 URL 파라미터와 세션 정보를 가져와 상태를 설정합니다.
     */
    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).clubid;
            const session = await getSessionClient();
            setUserid(Number(session!.id));
            setClubId(Number(resolvedParams));
        }
        fetchParams();
    }, [params]);

    /**
     * clubid가 설정되면 해당 클럽의 선수 목록을 불러옵니다.
     */
    useEffect(() => {
        async function fetchPlayers() {
            if (clubid === 0) return; // clubid가 설정될 때까지 API 호출을 방지합니다.
            const players = await getPlayersFromClub(clubid);
            console.log("clubid : ", clubid);
            setWaitPlayerList(players);
            setFirstWaitPlayerList(players);
        }
        fetchPlayers();
    }, [clubid]);

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
        setWaitPlayerList((currentWaitList) =>
            currentWaitList.map((p) => (p.id === player.id ? { ...p, lastGameDate: new Date() } : p))
        );
    }

    /**
     * 경기 결과를 제출하고 데이터베이스에 저장하는 함수입니다.
     * 선택된 선수, 점수, 클럽 ID 등을 사용하여 경기 결과를 생성합니다.
     */
    async function handleSubmitMatch() {
        // userid와 clubid가 유효한지 확인합니다.
        if (!userid || !clubid) {
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
            clubid,
            winner1,
            winner2,
            score1,
            score2,
        });

        const result = await makeMatch(allPlayerIds, userid, clubid, winner1, winner2, score1, score2);
        console.log("Match submission result:", result);

        // allPlayerIds의 숫자를 waitPlayerList의 id와 매치하여 lastGameDate에 현재시간을 입력함
        setWaitPlayerList((currentWaitList) =>
            currentWaitList
                .map((p) => (allPlayerIds.includes(p.id) ? { ...p, lastGameDate: new Date() } : p))
                .sort((a, b) => (b.lastGameDate?.getTime() || 0) - (a.lastGameDate?.getTime() || 0))
        );
        setFirstWaitPlayerList(waitPlayerList);

        // 상태 초기화
        setPlayerList([]);
        setScore1(25);
        setScore2(25);
    }

    return (
        // --- 렌더링 (Rendering) ---
        <div className="mb-16">
            <h1 className="text-3xl font-bold mb-4 text-center">게임 결과 입력</h1>
            <div className="flex h-1/2 flex-row gap-4">
                <div className="flex flex-col w-3/5 p-4 bg-white shadow-md rounded-lg">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Player 1</h2>
                        <div className="text-gray-700">{playerList[0] ? playerList[0].name : "No player selected"}</div>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Player 2</h2>
                        <div className="text-gray-700">{playerList[1] ? playerList[1].name : "No player selected"}</div>
                    </div>
                    {/* 점수 입력 컴포넌트 */}
                    <ScoreInput score1={score1} setScore1={setScore1} score2={score2} setScore2={setScore2} />
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Player 3</h2>
                        <div className="text-gray-700">{playerList[2] ? playerList[2].name : "No player selected"}</div>
                    </div>
                    <div className="mb-4">
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
                            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            결과입력
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
                            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            UNDO
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-2/5 p-4 bg-gray-100 shadow-md rounded-lg overflow-y-auto h-[calc(100vh-100px)]">
                    <input
                        className="p-2 m-2"
                        type="text"
                        placeholder="이름을 입력하세요"
                        onChange={(e) => {
                            console.log(e.target.value);
                            const copy = [...waitPlayerList];
                            console.log("copy is", copy);
                            if (e.target.value == "") {
                                setWaitPlayerList(firstWaitPlayerList);
                            }
                            if (e.target.value !== "") {
                                const filteredPlayers = firstWaitPlayerList.filter((player) =>
                                    player.name.includes(e.target.value)
                                );
                                console.log(filteredPlayers);
                                setWaitPlayerList(filteredPlayers);
                            }
                        }}
                    ></input>
                    {waitPlayerList.map((player) => (
                        <div
                            className="flex justify-between items-center p-2 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200"
                            onClick={() => handleClickedPlayer(player)}
                            key={player.id}
                        >
                            <div>
                                <h1 className="text-lg font-semibold">{player.name}</h1>
                                <div className="flex gap-2">
                                    <h2 className="text-sm text-gray-600">{player.age} </h2>
                                    <h2 className="text-sm text-gray-600">{player.grade}</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Link
                        href={{
                            pathname: `/diary/${clubid}/create`,
                            query: { userid: userid },
                        }}
                    >
                        <span className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                            새로만들기
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
