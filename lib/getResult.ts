import db from "./db";
import { Prisma } from "@prisma/client";

export type GameWithPlayers = Prisma.FantasyGameGetPayload<{
    include: {
        player1: true;
        player2: true;
    };
}>;

export async function getResult(date: string): Promise<GameWithPlayers[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const games = await db.fantasyGame.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            player1: true,
            player2: true,
        },
        orderBy: {
            id: "asc",
        },
    });
    return games;
}
