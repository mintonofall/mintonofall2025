"use client";
import getPlayerList from "@/lib/getPlayerList";
import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import Link from "next/link";

export default function WaitPlayerList({
    onClose,
    onEnterPlayer,
    waitPLayerList,
}: {
    onClose: () => void;
    onEnterPlayer: (id: number) => void;
    waitPLayerList: number[];
    clubId: number;
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
    const [playerListMsg, setPlayerListMsg] = useState("");

    useEffect(() => {
        async function fetchPlayers() {
            const players = await getPlayerList();
            setPlayerList(players);
            console.log(players);
        }
        fetchPlayers();
    }, []);

    const filteredPlayers = playerList.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div
            className="flex flex-col flex-nowrap fixed top-12 right-4
             bg-white p-4 h-full shadow-lg rounded overflow-y-scroll w-80 z-10
               "
        >
            <input
                type="text"
                placeholder="Search players"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <Link href={`/createPlayer/`}>
                <button className="w-full mt-4 p-2 bg-blue-500 text-white rounded">선수등록</button>
            </Link>
            <div className="text-red-600">{playerListMsg}</div>

            {filteredPlayers.map((player) => (
                <div
                    className="flex p-2"
                    key={player.id}
                    onClick={() => {
                        if (waitPLayerList.includes(player.id)) {
                            setPlayerListMsg("이미 대기중인 선수입니다.");
                        } else {
                            console.log("from Comp : ", player.id);
                            onEnterPlayer(player.id);
                            setPlayerListMsg("");
                            window.location.reload();
                            onClose();
                        }
                    }}
                >
                    <PlayerCard {...player} />
                </div>
            ))}
        </div>
    );
}
