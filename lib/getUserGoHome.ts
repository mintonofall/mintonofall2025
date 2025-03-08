"use server";
import db from "./db";
import { WaitGameListCLass } from "./interface";
import getSession from "./session";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nwpgfukfmivuzadqxewe.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cGdmdWtmbWl2dXphZHF4ZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODI5MjYsImV4cCI6MjA1MzM1ODkyNn0.1OMI0m8oKEhN-b5FbMrrycqNvC98j5dzf8WPvA4TT8Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function sendMessage(payload: string) {
    console.log("sendMessage");
    // Join a room/topic. Can be anything except for 'realtime'.
    const channelB = supabase.channel("room-1");

    const channelSubscribed = await new Promise<typeof channelB>((resolve, reject) => {
        channelB.subscribe((status) => {
            if (status === "SUBSCRIBED") {
                resolve(channelB);
            } else {
                reject("Could not subscribe to channel");
            }
        });
    });
    if (payload === "waitGames") {
        channelSubscribed.send({
            type: "broadcast",
            event: "waitGames",
            payload,
        });
    }
    if (payload === "gameboards") {
        channelSubscribed.send({
            type: "broadcast",
            event: "gameboards",
            payload,
        });
    }
}

export async function getUser() {
    const session = await getSession();
    console.log(session);
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        return user;
    }
}

export async function logout() {
    const session = getSession();
    (await session).destroy();
}

export async function getPlayer(id: number) {
    const player = await db.player.findUnique({
        where: {
            id,
        },
    });
    return player;
}

export async function gameOneUp(id: number) {
    const player = await db.player.update({
        where: {
            id,
        },
        data: {
            gameDatas: {
                push: new Date(),
            },
            games: {
                increment: 1,
            },
        },
    });
    return player;
}

export async function gameWinUp(id: number) {
    const player = await db.player.update({
        where: {
            id,
        },
        data: {
            win: {
                increment: 1,
            },
        },
    });
    return player;
}

export async function pushWaitPlayerList(Playerid: number, clubid: number) {
    const isEntered = await db.waitPlayerList.findFirst({
        where: {
            clubid,
            Playerid,
            enterDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        },
    });
    if (isEntered) {
        console.log("Player has entered today");
        return;
    }

    const pushPlayer = await db.waitPlayerList.create({
        data: {
            clubid,
            Playerid,
            enterDate: new Date(),
        },
    });
    console.log(pushPlayer);
    const player = await db.player.findUnique({
        where: {
            id: Playerid,
        },
    });
    if (player?.enterDatas.some((date) => new Date(date).toDateString() === new Date().toDateString())) {
        console.log("Player has entered today");
    } else {
        await db.player.update({
            where: {
                id: Playerid,
            },
            data: {
                enterDatas: {
                    push: new Date(),
                },
            },
        });
    }
}

export async function getWaitPlayerList(clubid: number) {
    const waitPlayerList = await db.waitPlayerList.findMany({
        where: {
            clubid,
            enterDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        },
        include: {
            player: true,
        },
    });
    return waitPlayerList;
}

export async function exitPlayer(Playerid: number, clubid: number) {
    const exitPlayer = await db.waitPlayerList.deleteMany({
        where: {
            clubid,
            Playerid,
        },
    });
    return exitPlayer;
}

export async function createWaitGame(clubid: number, playerid: number, point: number) {
    const waitGames = await db.waitGame.create({
        data: {
            clubid,
            playerid,
            point,
        },
    });
    return waitGames;
}

export async function oneGameDown(id: number) {
    const player = await db.player.findUnique({
        where: { id },
        select: { games: true, gameDatas: true },
    });

    if (!player || !player.gameDatas || player.gameDatas.length === 0) {
        throw new Error("No game data found for this player");
    }
    console.log(id, player.gameDatas);
    const updateGameDatas = player.gameDatas.slice(0, -1);
    console.log(id, updateGameDatas);

    await db.player.update({
        where: {
            id,
        },
        data: {
            games: {
                decrement: 1,
            },
            gameDatas: updateGameDatas,
        },
    });
}

export async function getWaitGames(clubid: number) {
    const waitGames = await db.waitGame.findMany({
        where: {
            clubid,
            updateTime: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        },
        orderBy: {
            point: "asc",
        },
    });
    return waitGames;
}

export const getClub = async (clubid: number) => {
    const club = await db.club.findUnique({
        where: {
            id: clubid,
        },
    });
    return club;
};

export const updateWaitGame = async (playerid: number, pointer: number) => {
    const waitGame = await db.waitGame.updateMany({
        where: {
            point: pointer,
        },
        data: { playerid },
    });
    return waitGame;
};

export const refreshWaitPlayer = async (clubid: number) => {
    const waitPlayerList = await db.waitPlayerList.findMany({
        where: {
            clubid,
            enterDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        },
    });
    return waitPlayerList;
};

export const refreshPlayer = async (clubid: number) => {
    const player = await db.player.findMany({
        where: {
            clubid,
        },
    });
    return player;
};

export const startMatch = async (
    clubid: number,
    player1id: number,
    player2id: number,
    player3id: number,
    player4id: number,
    CourtNumber: number,
    gameid: string
) => {
    const match = await db.gameBoard.updateMany({
        where: {
            clubid,
            CourtNumber,
        },
        data: {
            player1id,
            player2id,
            player3id,
            player4id,
            gameid,
        },
    });
    return match;
};

export const endMatch = async (matchId: string, winner: number[]) => {
    const match = await db.match.findFirst({
        where: {
            gameid: matchId,
        },
    });

    if (!match) {
        throw new Error(`Match with id ${matchId} not found`);
    }

    await db.match.updateMany({
        where: {
            gameid: matchId,
        },
        data: {
            endTime: new Date(),
            duration: new Date().getTime() - match.startTime.getTime(),
            winner1id: winner[0],
            winner2id: winner[1],
        },
    });
    if (winner[0]) {
        await db.player.update({
            where: {
                id: winner[0],
            },
            data: {
                winDatas: {
                    push: matchId,
                },
                win: {
                    increment: 1,
                },
            },
        });

        await db.player.update({
            where: {
                id: winner[1],
            },
            data: {
                winDatas: {
                    push: matchId,
                },
                win: {
                    increment: 1,
                },
            },
        });
    }
};

export const getMatch = async (clubid: number) => {
    const match = await db.gameBoard.findMany({
        where: {
            clubid,
        },
        orderBy: {
            CourtNumber: "asc",
        },
    });
    match.map(async (m) => {
        if (m.updateTime === null || m.updateTime < new Date(new Date().setHours(0, 0, 0, 0))) {
            console.log("m : ", m);
            m.player1id = 12;
            m.player2id = 12;
            m.player3id = 12;
            m.player4id = 12;
            m.gameid = "0";
            m.updateTime = new Date();
            await db.gameBoard.update({
                where: {
                    id: m.id,
                },

                data: m,
            });
        }
    });
    const copy = await db.gameBoard.findMany({
        where: {
            clubid,
        },
        orderBy: {
            CourtNumber: "asc",
        },
    });
    return copy;
};

export const clearPlayerGamesDb = async (clubid: number) => {
    await db.player.updateMany({
        where: {
            clubid,
        },
        data: {
            games: 0,
            win: 0,
            gameDatas: [],
            winDatas: [],
            loseDatas: [],
            enterDatas: [],
        },
    });
    console.log("Player games cleared");
};

export const deleteWaitGame = async (clubid: number, point: number) => {
    for (let i = point; i < point + 4; i++) {
        await db.waitGame.deleteMany({
            where: {
                clubid,
                point: i,
            },
        });
    }
};

export const resetWaitGames = async (clubid: number, waitGamesId: WaitGameListCLass[]) => {
    await db.waitGame.deleteMany({
        where: {
            clubid,
        },
    });
    const result = await db.waitGame.createMany({
        data: waitGamesId,
    });
    sendMessage("waitGames");
    return result;
};

export const pushUpWaitGame = async (clubid: number, point: number) => {
    await db.waitGame.updateMany({
        where: {
            clubid,
            point: {
                gte: point + 4,
            },
        },
        data: {
            point: {
                increment: -4,
            },
        },
    });
};

export const createMatch = async (
    gameid: string,
    clubid: number,
    p1: number,
    p2: number,
    p3: number,
    p4: number,
    winner: number[]
) => {
    const match = await db.match.create({
        data: {
            gameid,
            clubid,
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
            winner1id: winner[0],
            winner2id: winner[1],
            startTime: new Date(),
        },
    });
    return match;
};
