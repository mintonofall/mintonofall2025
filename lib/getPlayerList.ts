"use server";
import db from "./db";

async function getPlayerList(id: number) {
    const players = await db.player.findMany({
        where: {
            clubid: id,
        },
    });
    const gameNum: number = players
        .flatMap((player) => player.gameDatas)
        .filter((game) => {
            const today = new Date();
            const gameDate = new Date(game);
            return (
                gameDate.getDate() === today.getDate() &&
                gameDate.getMonth() === today.getMonth() &&
                gameDate.getFullYear() === today.getFullYear()
            );
        }).length;
    players.map((player) => {
        player.games = gameNum;
    });
    return players;
}

export default getPlayerList;
