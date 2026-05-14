"use client";
import PlayerCard from "@/app/component/PlayerCard";
import { Player } from "@/lib/interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deletePlayer } from "./action";

export default function PlayerListComponent({ playerList, id }: { playerList: Player[]; id: number }) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        setPlayers(playerList);
    }, [playerList]);

    const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleDelete = async (playerId: number) => {
        if (confirm("정말 이 플레이어를 삭제하시겠습니까?")) {
            await deletePlayer(playerId, id);
            setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== playerId));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col justify-between items-center mb-4">
                <div>
                    <Link
                        href={"/createPlayer/" + id}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-2"
                    >
                        선수등록
                    </Link>
                    <Link
                        href={"/home/" + id}
                        className="bg-blue-500 text-white px-4 py-2 mx-2 rounded hover:bg-blue-600"
                    >
                        게임판으로
                    </Link>
                </div>
                <input
                    type="text"
                    placeholder="Search players"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded m-4"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlayers.map((player) => (
                    <div key={player.id} className="bg-white shadow-md rounded p-4 flex justify-between items-center">
                        <PlayerCard {...player} />
                        <div className="flex gap-4">
                            <Link href={`/editPlayer/${player.id}`} className="text-gray-500 hover:text-blue-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                </svg>
                            </Link>
                            <button
                                onClick={() => handleDelete(player.id)}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
