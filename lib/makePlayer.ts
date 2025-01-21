"use server";

import db from "./db";

export async function makePlayer(fromClub: number, toClub: number) {
    const fromPlayer = await db.player.findMany({
        where: {
            clubid: fromClub,
        },
    });
    console.log(fromPlayer);
    const newClubPlayer = fromPlayer.map((player) => {
        player.clubid = toClub;
        delete (player as { id?: number }).id;
        return player;
    });

    console.log(newClubPlayer);
    const result = await db.player.createMany({
        data: newClubPlayer,
    });
    return result;
}
