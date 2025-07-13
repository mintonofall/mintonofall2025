"use client";

import { getMatch } from "@/lib/getClubDiary";
import getSessionClient from "@/lib/sessionClient";
import { useEffect, useState } from "react";

type Player = {
    id: number;
    userid: number | null;
    name: string;
    grade: string | null;
    gender: string | null;
    age: number | null;
    avater: string | null;
    clubid: number;
    mmr: number;
    isMe: boolean;
    createat: Date | null;
    lastGameDate: Date | null;
};

type Match = {
    id: number;
    userid: number | null;
    gameid: string | null;
    players: Player[];
    clubid: number;
    winner1id: number | null;
    winner2id: number | null;
    winner1: Player | null;
    winner2: Player | null;
    startTime: Date | null;
    endTime: Date | null;
    duration: number | null;
    score1: number | null;
    score2: number | null;
    createat: Date;
};

export default function Result({ params }: { params: Promise<{ clubid: string }> }) {
    const [matchs, setMatchs] = useState<Match[]>([]);

    useEffect(() => {
        async function fetchParams() {
            const session = await getSessionClient();
            if (session) {
                const data = await getMatch(Number(session.id));
                // 'any' 대신 명확한 타입을 사용하고, getMatch에서 반환된 데이터가 null을 포함할 수 있으므로 필터링합니다.
                const validData = data.map((match) => ({
                    ...match,
                    players: match.players.filter((player): player is Player => player !== null),
                }));
                setMatchs(validData);
            }
            const resolvedParams = (await params).clubid;
            console.log("clubid : ", resolvedParams);
        }
        fetchParams();
    }, []);

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
