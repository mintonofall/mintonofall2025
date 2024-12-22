import { exitPlayer, getPlayer } from "../../lib/getUserGoHome";
import PlayerCard from "./PlayerCard";
import { useEffect, useState } from "react";

export default function FromIdtoPlayerCard({ playerid, clubid, which }) {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        async function fetchPlayer() {
            try {
                const playerData = await getPlayer(playerid);
                setPlayer(playerData);
            } catch (error) {
                console.error("Failed to fetch player:", error);
            }
        }
        fetchPlayer();
    }, [playerid]);

    return (
        <div key={playerid} className="p-1 relative">
            {player ? <PlayerCard {...player} /> : <p>Player not found</p>}
            <button
                className={`${
                    which === "waitPlayer" ? "block" : "hidden"
                } absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs cursor-pointer`}
                onClick={() => {
                    exitPlayer(playerid, clubid);
                    window.location.reload();
                }}
            >
                X
            </button>
        </div>
    );
}
