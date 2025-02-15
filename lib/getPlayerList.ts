"use server";
import db from "./db";

async function getPlayerList(id: number, sort?: string) {
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
    const calWinToday = players.map((player) => {
        const gameDatas = player.gameDatas;
        const today = new Date().getDate();
        const winToday = gameDatas.filter((game) => {
            return game.getDate() === today;
        });
        return winToday.length;
    });
    players.map((player, index) => {
        player.games = calGameTaday[index];
        player.win = calWinToday[index];
    });
    if (sort === "name") {
        players.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }
    return players;
}

export default getPlayerList;
