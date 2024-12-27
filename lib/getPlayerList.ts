"use server";
import db from "./db";

async function getPlayerList(id: number) {
    const players = await db.player.findMany({
        where: {
            clubid: id,
        },
    });
    return players;
}

export default getPlayerList;
