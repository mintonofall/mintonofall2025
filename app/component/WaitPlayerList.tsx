"use client";
import getPlayerList from "@/lib/getPlayerList";
import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";

export default function WaitPlayerList({
    onClose,
    onEnterPlayer,
}: {
    onClose: () => void;
    onEnterPlayer: (id: number) => void;
}) {
    const [playerList, setPlayerList] = useState<
        {
            id: number;
            name: string;
            avater: string | null;
            age: number;
            grade: string;
            games: number;
            win: number;
            lose: number;
        }[]
    >([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchPlayers() {
            const players = await getPlayerList();
            setPlayerList(players);
        }
        fetchPlayers();
    }, []);

    const filteredPlayers = playerList.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed top-12 right-4 bg-white p-4 shadow-lg rounded max-h-[800px] overflow-y-auto">
            <input
                type="text"
                placeholder="Search players"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
                선수등록
            </button>
            <ul>
                {filteredPlayers.map((player) => (
                    <li
                        className="flex p-2"
                        key={player.id}
                        onClick={() => {
                            console.log("from Comp : ", player.id);
                            onEnterPlayer(player.id);
                            onClose();
                        }}
                    >
                        <PlayerCard {...player} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
