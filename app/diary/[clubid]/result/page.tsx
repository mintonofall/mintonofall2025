"use client";

import { getMatch } from "@/lib/getClubDiary";
import type { MatchDiaryWithPlayers } from "@/lib/getClubDiary";
import type { PlayerDiary } from "@prisma/client"; // PlayerDiary를 @prisma/client에서 직접 임포트
import getSessionClient from "@/lib/sessionClient";
import { useEffect, useState } from "react";

export default function Result({ params }: { params: { clubid: string } }) {
    const [matchs, setMatchs] = useState<MatchDiaryWithPlayers[]>([]);

    useEffect(() => {
        async function fetchParams() {
            const session = await getSessionClient();
            if (session) {
                const data = await getMatch(Number(session.id));
                // 'any' 대신 명확한 타입을 사용하고, getMatch에서 반환된 데이터가 null을 포함할 수 있으므로 필터링합니다.
                const validData: MatchDiaryWithPlayers[] = data.map((match: MatchDiaryWithPlayers) => ({
                    ...match,
                    players: match.players.filter((player: PlayerDiary): player is PlayerDiary => player !== null),
                }));
                setMatchs(validData);
            }
            // params는 이미 객체이므로 await 할 필요가 없습니다.
            console.log("clubid : ", params.clubid);
        }
        fetchParams();
    }, [params.clubid]); // params.clubid가 변경될 때 fetchParams를 다시 실행하도록 의존성 배열에 추가합니다.

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold text-center my-4">게임결과</h1>
                {matchs.length > 0 && (
                    <div>
                        {matchs.map((match) => (
                            <div key={match.id} className="p-4 mb-4 bg-white rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-lg">{match.players[0]?.name}</span>
                                    <span className="font-semibold text-lg">{match.players[2]?.name}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xl font-bold">{match.score1}</span>
                                    <span className="text-xl font-bold">-</span>
                                    <span className="text-xl font-bold">{match.score2}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-lg">{match.players[1]?.name}</span>
                                    <span className="font-semibold text-lg">{match.players[3]?.name}</span>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    {match.createat.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
                                </div>
                            </div>
                        ))}
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
                        <span>Created At: {matchs[0].createat.toString()}</spna>
                    </div>
                )} */}
            </div>
        </div>
    );
}
