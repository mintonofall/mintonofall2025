"use server";
import db from "./db";

async function getPlayerList() {
    const players = await db.player.findMany({
        where: {
            clubid: 1,
        },
    });
    return players;
}

export default getPlayerList;
