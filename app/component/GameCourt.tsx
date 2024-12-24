"use client";

import { getPlayer } from "@/lib/getUserGoHome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Interface } from "readline";
interface gameplayers {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    clubid: number;
    court: number;
}

interface Player {
    name: string;
    avater: string | null;
    age: number;
    grade: string;
    games: number;
    win: number;
    lose: number;
}

export default function GameCourt({ p1, p2, p3, p4, clubid, court }: gameplayers) {
    const [player1, setPlayer1] = useState<Player | null>(null);
    const [player2, setPlayer2] = useState<Player | null>(null);
    const [player3, setPlayer3] = useState<Player | null>(null);
    const [player4, setPlayer4] = useState<Player | null>(null);

    useEffect(() => {
        async function fetchPlayer() {
            try {
                const player1Data = await getPlayer(p1);
                const player2Data = await getPlayer(p2);
                const player3Data = await getPlayer(p3);
                const player4Data = await getPlayer(p4);

                setPlayer1(player1Data);
                setPlayer2(player2Data);
                setPlayer3(player3Data);
                setPlayer4(player4Data);
            } catch (error) {
                console.error("Failed to fetch player:", error);
            }
        }
        fetchPlayer();
    }, [p1, p2, p3, p4]);

    const player1Avatar = player1?.avater ? player1.avater + "/public" : "/guest.png";
    const player2Avatar = player2?.avater ? player2.avater + "/public" : "/guest.png";
    const player3Avatar = player3?.avater ? player3.avater + "/public" : "/guest.png";
    const player4Avatar = player4?.avater ? player4.avater + "/public" : "/guest.png";

    return (
        <div className="flex flex-col w-full h-full p-1">
            <div className="text-xs text-center">Court {court}</div>
            <div className="flex bg-yellow-300 h-1/2">
                <div className="flex flex-row justify-center items-center w-1/2  bg-blue-300">
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src={player1Avatar}
                            alt="1"
                            width={50}
                            height={50}
                            style={{
                                objectFit: "cover",
                                width: "50px",
                                height: "50px",
                            }}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="text-xs">{player1?.name}</div>
                        <div>
                            {player1?.age}
                            {player1?.grade}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center w-1/2  bg-green-200">
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src={player2Avatar}
                            alt="1"
                            width={50}
                            height={50}
                            style={{
                                objectFit: "cover",
                                width: "50px",
                                height: "50px",
                            }}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="text-xs">{player2?.name}</div>
                        <div>
                            {player2?.age}
                            {player2?.grade}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row h-1/2">
                <div className="flex flex-row justify-center items-center w-1/2  bg-red-200">
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src={player3Avatar}
                            alt="1"
                            width={50}
                            height={50}
                            style={{
                                objectFit: "cover",
                                width: "50px",
                                height: "50px",
                            }}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="text-xs">{player3?.name}</div>
                        <div>
                            {player2?.age}
                            {player2?.grade}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center w-1/2  bg-purple-200">
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src={player4Avatar}
                            alt="1"
                            width={50}
                            height={50}
                            style={{
                                objectFit: "cover",
                                width: "50px",
                                height: "50px",
                            }}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="text-xs">{player4?.name}</div>
                        <div>
                            {player4?.age}
                            {player4?.grade}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
