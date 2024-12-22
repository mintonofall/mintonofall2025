import { getPlayer } from "../../lib/getUserGoHome";
import PlayerCard from "./PlayerCard";
import { useEffect, useState } from "react";

export default function FromIdtoPlayerCard({ id }) {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        async function fetchPlayer() {
            try {
                const playerData = await getPlayer(id);
                setPlayer(playerData);
            } catch (error) {
                console.error("Failed to fetch player:", error);
            }
        }
        fetchPlayer();
    }, [id]);

    return (
        <div>
            {id}
            {player ? <PlayerCard {...player} /> : <p>Player not found</p>}
        </div>
    );
}
