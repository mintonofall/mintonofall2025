"use client";

import { getMatch, getPlayersFromClub } from "@/lib/getClubDiary";
import type { MatchDiaryWithPlayers, PlayerDiary } from "@/lib/types"; // lib/types에서 임포트
import getSessionClient from "@/lib/sessionClient";
import { useEffect, useState } from "react";

export default function Result({ params }: { params: Promise<{ clubid: string }> }) {
    const [matchs, setMatchs] = useState<MatchDiaryWithPlayers[]>([]);
    const [me, setMe] = useState<PlayerDiary | null>(null);

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
                                        <span className="text-xl font-bold">{leftScore}</span>
                                        <span className="text-xl font-bold">-</span>
                                        <span className="text-xl font-bold">{rightScore}</span>
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
                                    <div className="text-right text-sm text-gray-500">
                                        {match.startTime.toLocaleDateString("ko-KR", {
                                            month: "long",
                                            day: "numeric",
                                        })}
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
