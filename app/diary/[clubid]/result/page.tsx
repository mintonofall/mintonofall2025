"use client";

import { getMatch, getPlayersFromClub, deleteMatch, updateMatchScore } from "@/lib/getClubDiary";
import type { MatchDiaryWithPlayers, PlayerDiary } from "@/lib/types"; // lib/types에서 임포트
import getSessionClient from "@/lib/sessionClient";
import { useEffect, useState } from "react";

export default function Result({ params }: { params: Promise<{ clubid: string }> }) {
    const [matchs, setMatchs] = useState<MatchDiaryWithPlayers[]>([]);
    const [me, setMe] = useState<PlayerDiary | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editLeft, setEditLeft] = useState(0);
    const [editRight, setEditRight] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchParams() {
            const { clubid } = await params;
            const session = await getSessionClient();
            if (session) {
                const userid = Number(session.id);
                const [data, playerList] = await Promise.all([getMatch(userid), getPlayersFromClub(userid)]);
                // 'any' 대신 명확한 타입을 사용하고, getMatch에서 반환된 데이터가 null을 포함할 수 있으므로 필터링합니다.
                const validData: MatchDiaryWithPlayers[] = data.map((match: MatchDiaryWithPlayers) => ({
                    ...match,
                    players: match.players.filter((player: PlayerDiary): player is PlayerDiary => player !== null),
                }));
                setMatchs(validData);
                setMe(playerList.find((p) => p.isMe) || null);
            }
            console.log("clubid : ", clubid);
        }
        fetchParams();
    }, [params]);

    /**
     * 경기 기록을 삭제합니다.
     * @param {number} matchId - 삭제할 경기(MatchDiary)의 ID
     */
    async function handleDelete(matchId: number) {
        if (!confirm("이 경기 기록을 삭제할까요?")) return;
        await deleteMatch(matchId);
        setMatchs((prev) => prev.filter((m) => m.id !== matchId));
    }

    /**
     * 점수 수정을 시작합니다. 화면에 표시되는 좌/우 순서(주인공 기준 재배열) 그대로 입력값을 채웁니다.
     * @param {MatchDiaryWithPlayers} match - 수정할 경기
     * @param {number | null} leftScore - 화면 왼쪽에 표시되는 점수
     * @param {number | null} rightScore - 화면 오른쪽에 표시되는 점수
     */
    function startEdit(match: MatchDiaryWithPlayers, leftScore: number | null, rightScore: number | null) {
        setEditingId(match.id);
        setEditLeft(leftScore ?? 0);
        setEditRight(rightScore ?? 0);
    }

    /**
     * 수정한 점수를 저장합니다. 화면 좌/우 점수를 다시 팀1/팀2(score1/score2) 점수로 되돌리고,
     * 더 높은 점수를 받은 팀을 승자로 재계산합니다.
     * @param {MatchDiaryWithPlayers} match - 수정 중인 경기
     * @param {boolean} isSwapped - 주인공이 팀2라서 화면 좌/우가 뒤집혀 표시되고 있는지 여부
     */
    async function handleSaveEdit(match: MatchDiaryWithPlayers, isSwapped: boolean) {
        if (editLeft === editRight) {
            alert("무승부는 입력할 수 없습니다.");
            return;
        }

        const newScore1 = isSwapped ? editRight : editLeft;
        const newScore2 = isSwapped ? editLeft : editRight;
        const team1Won = newScore1 > newScore2;
        const winner1id = (team1Won ? match.players[0]?.id : match.players[2]?.id) ?? null;
        const winner2id = (team1Won ? match.players[1]?.id : match.players[3]?.id) ?? null;

        setIsSaving(true);
        try {
            await updateMatchScore(match.id, newScore1, newScore2, winner1id, winner2id);
            setMatchs((prev) =>
                prev.map((m) =>
                    m.id === match.id ? { ...m, score1: newScore1, score2: newScore2, winner1id, winner2id } : m,
                ),
            );
            setEditingId(null);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold text-center my-4">게임결과</h1>
                {matchs.length > 0 && (
                    <div>
                        {matchs.map((match) => {
                            // 1,2번 선수가 한 팀, 3,4번 선수가 다른 팀입니다 (게임 결과 입력 시 편성 기준).
                            const [p0, p1, p2, p3] = match.players;
                            const team1Ids = [p0?.id, p1?.id];
                            const team2Ids = [p2?.id, p3?.id];
                            const decided = match.winner1id != null;
                            const team1Won = decided && team1Ids.includes(match.winner1id!);
                            const meInMatch = !!me && match.players.some((p) => p.id === me.id);
                            const meWon = meInMatch && decided && team1Ids.includes(me!.id) === team1Won;

                            // 주인공이 항상 왼쪽 위에 보이도록 표시 순서를 재배열합니다.
                            let leftTop = p0;
                            let leftBottom = p1;
                            let rightTop = p2;
                            let rightBottom = p3;
                            let leftScore = match.score1;
                            let rightScore = match.score2;
                            let leftWon = team1Won;

                            if (me && team2Ids.includes(me.id)) {
                                leftTop = p2;
                                leftBottom = p3;
                                rightTop = p0;
                                rightBottom = p1;
                                leftScore = match.score2;
                                rightScore = match.score1;
                                leftWon = decided && !team1Won;
                            }
                            if (me && leftBottom?.id === me.id) {
                                [leftTop, leftBottom] = [leftBottom, leftTop];
                            }

                            const isSwapped = !!(me && team2Ids.includes(me.id));
                            const isEditing = editingId === match.id;

                            return (
                                <div key={match.id} className="p-4 mb-4 bg-white rounded-lg shadow-md">
                                    {meInMatch && decided && (
                                        <div className="mb-2">
                                            <span
                                                className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                                                    meWon ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {meWon ? "승" : "패"}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-semibold text-lg ${leftWon ? "text-blue-600" : ""}`}>
                                            {leftTop?.name}
                                        </span>
                                        <span
                                            className={`font-semibold text-lg ${decided && !leftWon ? "text-blue-600" : ""}`}
                                        >
                                            {rightTop?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={editLeft}
                                                    onChange={(e) => setEditLeft(Number(e.target.value))}
                                                    className="w-16 text-xl font-bold text-center border border-gray-300 rounded"
                                                />
                                                <span className="text-xl font-bold">-</span>
                                                <input
                                                    type="number"
                                                    value={editRight}
                                                    onChange={(e) => setEditRight(Number(e.target.value))}
                                                    className="w-16 text-xl font-bold text-center border border-gray-300 rounded"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xl font-bold">{leftScore}</span>
                                                <span className="text-xl font-bold">-</span>
                                                <span className="text-xl font-bold">{rightScore}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-semibold text-lg ${leftWon ? "text-blue-600" : ""}`}>
                                            {leftBottom?.name}
                                        </span>
                                        <span
                                            className={`font-semibold text-lg ${decided && !leftWon ? "text-blue-600" : ""}`}
                                        >
                                            {rightBottom?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveEdit(match, isSwapped)}
                                                        disabled={isSaving}
                                                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                                                    >
                                                        {isSaving ? "저장 중..." : "저장"}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        disabled={isSaving}
                                                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                                    >
                                                        취소
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(match, leftScore, rightScore)}
                                                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(match.id)}
                                                        className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                                                    >
                                                        삭제
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {match.startTime.toLocaleDateString("ko-KR", {
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* {matchs.length > 0 && (
                    <div>
                        <span>Match ID: {matchs[0].id}</p>
                        <span>User ID: {matchs[0].userid}</p>
                        <span>Game ID: {matchs[0].gameid}</p>
                        <span>Players: {matchs[0].players.join(", ")}</p>
                        <span>Club ID: {matchs[0].clubid}</p>
                        <span>Winner 1 ID: {matchs[0].winner1id}</p>
                        <span>Winner 2 ID: {matchs[0].winner2id}</p>
                        <span>Start Time: {matchs[0].startTime?.toString()}</p>
                        <span>End Time: {matchs[0].endTime?.toString()}</p>
                        <span>Duration: {matchs[0].duration}</p>
                        <span>Score 1: {matchs[0].score1}</p>
                        <span>Score 2: {matchs[0].score2}</p>
                        <span>Created At: {matchs[0].createdAt.toString()}</spna>
                    </div>
                )} */}
            </div>
        </div>
    );
}
