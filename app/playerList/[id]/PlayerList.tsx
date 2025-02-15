"use client";
import PlayerCard from "@/app/component/PlayerCard";
import { Player } from "@/lib/interface";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PlayerListComponent({ playerList, id }: { playerList: Player[]; id: number }) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        setPlayers(playerList);
    }, [playerList]);

    const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                        <Link href={`/editPlayer/${player.id}`} className="text-gray-500 hover:text-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                            >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
