"use client";
import getPlayerList from "@/lib/getPlayerList";
import { useEffect, useState } from "react";

export default function WaitPlayerList({ onClose }: { onClose: () => void }) {
    const [playerList, setPlayerList] = useState<
        { id: number; name: string }[]
    >([]);

    useEffect(() => {
        async function fetchPlayers() {
            const players = await getPlayerList();
            setPlayerList(players);
        }
        fetchPlayers();
    }, []);

    return (
        <div className="fixed bottom-20 right-4 bg-white p-4 shadow-lg rounded">
            <ul>
                {playerList.map((player) => (
                    <li key={player.id} onClick={onClose}>
                        {player.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
