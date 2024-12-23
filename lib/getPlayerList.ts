"use server";
import db from "./db";

async function getPlayerList() {
    const players = await db.player.findMany({
        where: {
            clubid: 1,
        },
    });
    console.log(players);
    return players;
}

export default getPlayerList;
