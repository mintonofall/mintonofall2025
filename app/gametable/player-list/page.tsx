import db from "@/lib/db";
import PlayerListClient from "./PlayerListClient";

export default async function PlayerList() {
    const players = await db.dogPlayer.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return <PlayerListClient players={players} />;
}
