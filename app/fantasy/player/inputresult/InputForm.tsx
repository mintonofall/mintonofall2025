"use client";

import { createFantasyGame } from "@/lib/fantasy";
import { FantasyPlayer } from "@prisma/client";
import { useState, useRef } from "react";

interface InputFormProps {
    players: FantasyPlayer[];
}

export default function InputForm({ players }: InputFormProps) {
    const [player1Id, setPlayer1Id] = useState("");
    const [player2Id, setPlayer2Id] = useState("");
    const gameResultRef = useRef<HTMLInputElement>(null);

    const handlePlayerClick = (playerId: number) => {
        const newPlayerId = playerId.toString();
        if (player1Id === "") {
            setPlayer1Id(newPlayerId);
        } else if (player2Id === "") {
            // 선수1과 다른 선수일 경우에만 선수2로 등록
            if (player1Id !== newPlayerId) {
                setPlayer2Id(newPlayerId);
                gameResultRef.current?.focus();
            }
        }
    };

    return (
        <>
            <form action={createFantasyGame} className="space-y-4">
                <div>
                    <label htmlFor="player1Id" className="block text-sm font-medium text-slate-700">
                        선수 1 ID
                    </label>
                    <input
                        type="number"
                        id="player1Id"
                        name="player1Id"
                        required
                        placeholder="선수 ID를 입력하거나 아래 목록에서 클릭하세요"
                        value={player1Id}
                        onChange={(e) => setPlayer1Id(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="player2Id" className="block text-sm font-medium text-slate-700">
                        선수 2 ID
                    </label>
                    <input
                        type="number"
                        id="player2Id"
                        name="player2Id"
                        required
                        placeholder="선수 ID를 입력하거나 아래 목록에서 클릭하세요"
                        value={player2Id}
                        onChange={(e) => setPlayer2Id(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                        경기 날짜
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        defaultValue="2024-12-13"
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="gameResult" className="block text-sm font-medium text-slate-700">
                        경기 결과 (쉼표로 구분)
                    </label>
                    <input
                        ref={gameResultRef}
                        type="text"
                        id="gameResult"
                        name="gameResult"
                        required
                        placeholder="예: 21,18,21"
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    <p className="mt-2 text-sm text-slate-500">
                        선수 1의 득점을 기준으로 각 세트의 점수를 쉼표로 구분하여 입력해주세요.
                    </p>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                        결과 입력
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">2024년 선수 명단</h2>
                    <button
                        onClick={() => {
                            setPlayer1Id("");
                            setPlayer2Id("");
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-slate-500 rounded-md hover:bg-slate-600"
                    >
                        선택 초기화
                    </button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-center">
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className={`p-2 border rounded-md cursor-pointer hover:bg-sky-100 ${
                                player1Id === player.id.toString() || player2Id === player.id.toString()
                                    ? "bg-sky-200 ring-2 ring-sky-500"
                                    : "bg-slate-50"
                            }`}
                            onClick={() => handlePlayerClick(player.id)}
                        >
                            <div className="text-xs font-bold text-slate-500">{player.id}</div>
                            <div className="text-sm font-medium break-words">{player.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
