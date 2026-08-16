"use client";
import getPlayerList from "@/lib/getPlayerList";
import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import Link from "next/link";
import { Player } from "@/lib/interface";
interface WaitPlayerListProps {
    id: number | null;
    clubid: number;
    Playerid: number;
    enterDate: Date;
    exitDate: Date | null;
}

export default function WaitPlayerList({
    onClose,
    onEnterPlayer,
    waitPLayerList,
    clubid,
}: {
    onClose: () => void;
    onEnterPlayer: (id: number) => void;
    waitPLayerList: WaitPlayerListProps[];
    clubid: number;
}) {
    const [playerList, setPlayerList] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [playerListMsg, setPlayerListMsg] = useState("");

    useEffect(() => {
        async function fetchPlayers() {
            const players = await getPlayerList(clubid, "name");
            setPlayerList(players);
            console.log(players);
        }
        fetchPlayers();
    }, []);

    const filteredPlayers = playerList.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div
            className="flex flex-col flex-nowrap fixed top-12 right-4
             bg-white p-4 h-full shadow-xl border-l border-blue-100 overflow-y-scroll w-80 z-10 gap-2
               "
        >
            <input
                type="text"
                placeholder="선수 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow"
            />
            <Link href={`/createPlayer/${clubid}`}>
                <button className="w-full mt-2 mb-2 p-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-sm transition-colors">
                    선수등록
                </button>
            </Link>
            <div className="text-rose-500 text-sm font-medium">{playerListMsg}</div>

            {filteredPlayers.map((player) => (
                <div className="flex gap-2 items-center" key={player.id}>
                    <div
                        className="w-full cursor-pointer"
                        onClick={() => {
                            if (waitPLayerList.find((p) => p.Playerid === player.id)) {
                                setPlayerListMsg("이미 대기중인 선수입니다.");
                            } else {
                                console.log("from Comp : ", player.id);
                                onEnterPlayer(player.id);
                                setPlayerListMsg("");
                                onClose();
                            }
                        }}
                    >
                        <PlayerCard {...player} />
                    </div>
                    <Link href={`/editPlayer/${player.id}`} className="text-slate-400 hover:text-blue-500 transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                        >
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                    </Link>
                </div>
            ))}
        </div>
    );
}
