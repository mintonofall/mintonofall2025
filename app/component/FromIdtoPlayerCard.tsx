import { Player } from "@/lib/interface";
import { exitPlayer, getPlayer } from "../../lib/getUserGoHome";
import PlayerCard from "./PlayerCard";
import { useEffect, useState } from "react";

interface Props {
    key: number;
    player: Player;
    clubid: number;
    which: string;
}

export default function FromIdtoPlayerCard({ key, player, clubid, which }: Props) {
    const [playerState, setPlayerState] = useState<Player | null>(null);

    return (
        <div key={key} className="p-1 relative">
            {player ? <PlayerCard {...player} /> : <p>Player not found</p>}
            <button
                className={`${
                    which === "waitPlayer" ? "block" : "hidden"
                } absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs cursor-pointer`}
                onClick={() => {
                    exitPlayer(player.id, clubid);
                }}
            >
                X
            </button>
        </div>
    );
}
