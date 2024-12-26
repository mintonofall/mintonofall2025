"use client";

import { endMatch, getPlayer } from "@/lib/getUserGoHome";
import Image from "next/image";
import { useEffect, useState } from "react";

interface gameplayers {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    clubid: number;
    court: number;
    gameid: number;
    onEndMatch: () => void;
}

interface Player {
    id: number;
    name: string;
    avater: string | null;
    age: number;
    grade: string;
    games: number;
    win: number;
    lose: number;
}

export default function GameCourt({ p1, p2, p3, p4, court, gameid, onEndMatch }: gameplayers) {
    const [player1, setPlayer1] = useState<Player | null>(null);
    const [player2, setPlayer2] = useState<Player | null>(null);
    const [player3, setPlayer3] = useState<Player | null>(null);
    const [player4, setPlayer4] = useState<Player | null>(null);
    const [isShowResult, setIsShowResult] = useState(false);
    const [winnerpoint, setWinnerpoint] = useState<number[]>([]);
    useEffect(() => {
        async function fetchPlayers() {
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
        fetchPlayers();
    }, [p1, p2, p3, p4]);

    const player1Avatar = player1?.avater ? player1.avater + "/avatar" : "/guest.png";
    const player2Avatar = player2?.avater ? player2.avater + "/avatar" : "/guest.png";
    const player3Avatar = player3?.avater ? player3.avater + "/avatar" : "/guest.png";
    const player4Avatar = player4?.avater ? player4.avater + "/avatar" : "/guest.png";

    const endMatchFunction = async (gameid: number, winner: number[]) => {
        await endMatch(gameid, winner);
    };
    function selectWinner(winner: number) {
        return function () {
            console.log("Winner is:", winner);
            if (winnerpoint.length === 0) {
                setWinnerpoint([winner]);
            } else if (winnerpoint.length === 1 && winnerpoint[0] !== winner) {
                const data = [...winnerpoint, winner];
                setWinnerpoint(data);
            } else if (winnerpoint.length === 1 && winnerpoint[0] === winner) {
                setWinnerpoint([]);
            } else if (winnerpoint.length === 2) {
                if (winnerpoint[0] === winner) {
                    const data = [winnerpoint[1]];
                    setWinnerpoint(data);
                } else if (winnerpoint[1] === winner) {
                    const data = [winnerpoint[0]];
                    setWinnerpoint(data);
                }
            }
        };
    }

    return (
        <>
            <div className="flex flex-col w-full h-full p-1 space-y-0 z-10">
                <div className="text-lg font-semibold text-center text-gray-700">Court {court}</div>
                <div className="flex h-1/2 space-x-0">
                    <div className="flex flex-row justify-center items-center w-1/2 bg-blue-300 p-2 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player1Avatar}
                                alt="Player 1"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">{player1?.name}</div>
                            <div className="text-xs text-gray-600">
                                {player1?.age}
                                {player1?.grade}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-1/2 bg-green-200 p-2 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player2Avatar}
                                alt="Player 2"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">{player2?.name}</div>
                            <div className="text-xs text-gray-600">
                                {player2?.age}
                                {player2?.grade}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex h-1/2 space-x-0">
                    <div className="flex flex-row justify-center items-center w-1/2 bg-red-200 p-2 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player3Avatar}
                                alt="Player 3"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">{player3?.name}</div>
                            <div className="text-xs text-gray-600">
                                {player3?.age}
                                {player3?.grade}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-1/2 bg-purple-200 p-2 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player4Avatar}
                                alt="Player 4"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">{player4?.name}</div>
                            <div className="text-xs text-gray-600">
                                {player4?.age}
                                {player4?.grade}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center space-x-4">
                    <div
                        className="text-center bg-red-500 text-white w-1/2 rounded-full cursor-pointer py-0"
                        onClick={() => setIsShowResult(!isShowResult)}
                    >
                        게임종료
                    </div>
                </div>
            </div>

            <div
                className={`fixed z-40 left-0 w-full h-1/2 bg-black bg-opacity-50  ${
                    isShowResult ? "block" : "hidden"
                }`}
            >
                <div
                    className="relative  left-1/2 transform -translate-x-1/2 bg-white rounded-t-lg shadow-lg
                 space-y-4 w-1/4 max-w-md"
                >
                    <div className="text-center text-lg font-semibold">승리자를 입력하세요</div>
                    <div className="flex flex-col p-0 space-y-0">
                        <div className="flex flex-row p-0 justify-evenly items-center space-x-0">
                            <div
                                onClick={selectWinner(1)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(1) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player1Avatar}
                                    alt="Player 1"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{player1?.name}</div>
                            </div>
                            <div
                                onClick={selectWinner(2)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(2) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player2Avatar}
                                    alt="Player 2"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{player2?.name}</div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center space-x-0">
                            <div
                                onClick={selectWinner(3)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(3) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player3Avatar}
                                    alt="Player 3"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{player3?.name}</div>
                            </div>
                            <div
                                onClick={selectWinner(4)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(4) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player4Avatar}
                                    alt="Player 4"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{player4?.name}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center text-center gap-1">
                        <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            onClick={() => {
                                if (winnerpoint.length === 0) {
                                    endMatchFunction(gameid, []);
                                    onEndMatch();
                                    setIsShowResult(false);
                                    setWinnerpoint([]);
                                }
                                if (winnerpoint.length !== 2) {
                                    alert("승리자를 두명 선택해주세요.");
                                }
                                if (winnerpoint.length === 2) {
                                    endMatchFunction(gameid, winnerpoint);
                                    onEndMatch();
                                    setIsShowResult(false);
                                    setWinnerpoint([]);
                                }
                            }}
                        >
                            결과입력
                        </button>
                        <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            onClick={() => {
                                setIsShowResult(false);
                                setWinnerpoint([]);
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
