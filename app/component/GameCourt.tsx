"use client";

import { endMatch } from "@/lib/getUserGoHome";
import Image from "next/image";
import { useState } from "react";
import { Player } from "@/lib/interface";

interface gameplayers {
    p1: Player;
    p2: Player;
    p3: Player;
    p4: Player;
    clubid: number;
    court: number;
    gameid: string;
    onEndMatch: () => void;
    onWinsUp: (winner: number[]) => void;
}

export default function GameCourt({ p1, p2, p3, p4, court, gameid, onEndMatch, onWinsUp }: gameplayers) {
    const [isShowResult, setIsShowResult] = useState(false);
    const [winnerpoint, setWinnerpoint] = useState<number[]>([]);
    const player1Avatar = p1?.avater ? p1.avater + "/avatar" : "/guest.png";
    const player2Avatar = p2?.avater ? p2.avater + "/avatar" : "/guest.png";
    const player3Avatar = p3?.avater ? p3.avater + "/avatar" : "/guest.png";
    const player4Avatar = p4?.avater ? p4.avater + "/avatar" : "/guest.png";

    const endMatchFunction = async (gameid: string, winner: number[]) => {
        const players = [p1, p2, p3, p4];
        console.log("endMatchFunction", players);
        const newwinner1: number = players[winner[0] - 1].id;
        const newwinner2: number = players[winner[1] - 1].id;
        const newWinners = [newwinner1, newwinner2];
        onWinsUp(newWinners);
        await endMatch(gameid, newWinners);
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
                            <div className="text-sm font-medium text-gray-800">{p1?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p1?.age}
                                {p1?.grade}
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
                            <div className="text-sm font-medium text-gray-800">{p2?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p2?.age}
                                {p2?.grade}
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
                            <div className="text-sm font-medium text-gray-800">{p3?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p3?.age}
                                {p3?.grade}
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
                            <div className="text-sm font-medium text-gray-800">{p4?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p4?.age}
                                {p4?.grade}
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
                                <div className="text-sm font-medium text-gray-800">{p1?.name}</div>
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
                                <div className="text-sm font-medium text-gray-800">{p2?.name}</div>
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
                                <div className="text-sm font-medium text-gray-800">{p3?.name}</div>
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
                                <div className="text-sm font-medium text-gray-800">{p4?.name}</div>
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
                                if (winnerpoint.length === 1) {
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
