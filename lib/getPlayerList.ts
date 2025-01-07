"use server";
import db from "./db";

async function getPlayerList(id: number) {
    const players = await db.player.findMany({
        where: {
            clubid: id,
        },
    });

    const calGameTaday = players.map((player) => {
        const gameDatas = player.gameDatas;
        const today = new Date().getDate();
        const gameToday = gameDatas.filter((game) => {
            return game.getDate() === today;
        });
        return gameToday.length;
    });
    players.map((player, index) => {
        player.games = calGameTaday[index];
    });
    return players;
}

export default getPlayerList;
