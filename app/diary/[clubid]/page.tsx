"use client";

import { useEffect, useState } from "react";
import { getPlayersFromClub } from "@/lib/getClubDiary";
import { PlayerDiary } from "@/lib/interface";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Diary({ params }: { params: Promise<{ id: number }> }) {
    const [waitPlayerList, setWaitPlayerList] = useState<PlayerDiary[]>([]);
    const [id, setId] = useState(0);
    const [playerList, setPlayerList] = useState<PlayerDiary[]>([]);
    const [score1, setScore1] = useState<number>(25);
    const [score2, setScore2] = useState<number>(25);
    // const fakeDB = ["김민준", "이서준", "박예준", "최지우", "정하윤", "강서연", "윤지호", "임도윤", "오하린", "서윤아"];
    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).id;
            setId(resolvedParams);
        }

        fetchParams();
    }, [params]);
    useEffect(() => {
        async function fetchPlayers() {
            const players = await getPlayersFromClub(id);
            setWaitPlayerList(players);
            console.log(players);
        }
        fetchPlayers();
    }, [id]);

    function handleClickedPlayer(player: PlayerDiary) {
        console.log(player.name);
        if (playerList.length >= 4) return;
        const copy = [...playerList];
        copy.push(player);
        setPlayerList(copy);
    }

    return (
        <div>
            <h1>Diary</h1>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ flex: 7, backgroundColor: "#f0f0f0" }}>
                    <div>
                        <h2>Player 1</h2>
                        <div>{playerList[0] ? playerList[0].name : null}</div>
                    </div>
                    <div>
                        <h2>Player 2</h2>
                        <div>{playerList[1] ? playerList[1].name : null}</div>
                    </div>
                    <div>{score1}</div>
                    <div className="flex gap-1">
                        <MinusCircleIcon onClick={() => setScore1(score1 - 1)} className="h-6 w-6" />
                        <PlusCircleIcon onClick={() => setScore1(score1 + 1)} className="h-6 w-6" />
                    </div>
                    <div className="border-b border-black my-2"></div>
                    <div className="flex gap-1">
                        <MinusCircleIcon onClick={() => setScore2(score2 - 1)} className="h-6 w-6" />
                        <PlusCircleIcon onClick={() => setScore2(score1 + 1)} className="h-6 w-6" />
                    </div>
                    <div>{score2}</div>
                    <div>
                        <h2>Player 3</h2>
                        <div>{playerList[2] ? playerList[2].name : null}</div>
                    </div>
                    <div>
                        <h2>Player 4</h2>
                        <div>{playerList[3] ? playerList[3].name : null}</div>
                    </div>
                    {/* Left section content */}
                </div>
                <div style={{ flex: 3, backgroundColor: "#d0d0d0" }}>
                    {waitPlayerList.map((player) => {
                        return (
                            <div
                                className="flex"
                                onClick={() => {
                                    handleClickedPlayer(player);
                                }}
                                key={player.id}
                            >
                                <h1>{player.name}</h1>
                                <h2>{player.age}</h2>
                                <h2>{player.grade}</h2>
                            </div>
                        );
                    })}
                    {/* Right section content */}
                </div>
            </div>
            <button
                onClick={() => {
                    console.log(playerList);
                    console.log(score1);
                    console.log(score2);
                }}
            >
                결과입력
            </button>
        </div>
    );
}
