"use server";
import { redirect } from "next/navigation";
import db from "./db";
import getSession from "./session";
import { NextResponse } from "next/server";

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
    const pushPlayer = await db.waitPlayerList.create({
        data: {
            clubid,
            Playerid,
            enterDate: new Date(),
            exitDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
    });
    console.log(pushPlayer);
}

export async function getWaitPlayerList(clubid: number) {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const waitPlayerList = await db.waitPlayerList.findMany({
        where: {
            clubid,
            enterDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
            exitDate: {
                lt: today,
            },
        },
        orderBy: {
            player: {
                games: "asc",
            },
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
}

export async function getWaitGames(clubid: number) {
    const waitGames = await db.waitGame.findMany({
        where: {
            clubid,
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
};

export const startMatch = async (
    clubid: number,
    player1id: number,
    player2id: number,
    player3id: number,
    player4id: number,
    CourtNumber: number,
    gameid: number
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
};

export const endMatch = async (id: number, winner: number[]) => {
    const match = await db.match.findUnique({
        where: {
            id,
        },
    });
    let winner1id = 12;
    let winner2id = 12;
    if (match) {
        if (winner[0] !== null) {
            switch (winner[0]) {
                case 1:
                    winner1id = match.player1id;
                    break;
                case 2:
                    winner1id = match.player2id;
                    break;
                case 3:
                    winner1id = match.player3id;
                    break;
                case 4:
                    winner1id = match.player4id;
                    break;
            }
            switch (winner[1]) {
                case 1:
                    winner2id = match.player1id;
                    break;
                case 2:
                    winner2id = match.player2id;
                    break;
                case 3:
                    winner2id = match.player3id;
                    break;
                case 4:
                    winner2id = match.player4id;
                    break;
            }
        }
    }
    const endMatch = await db.match.update({
        where: {
            id,
        },
        data: {
            endTime: new Date(),
            duration: new Date().getTime() - match!.startTime.getTime(),
            winner1id,
            winner2id,
        },
    });
    const winOneUP = await db.player.update({
        where: {
            id: winner1id,
        },
        data: {
            win: {
                increment: 1,
            },
        },
    });
    const winTwoUP = await db.player.update({
        where: {
            id: winner2id,
        },
        data: {
            win: {
                increment: 1,
            },
        },
    });
};

export const getMatch = async (clubid: number, CourtNumber: number) => {
    const match = await db.gameBoard.findMany({
        where: {
            clubid,
            CourtNumber,
        },
    });
    return match;
};

export const deleteWaitGame = async (clubid: number, point: number) => {
    for (let i = point; i < point + 4; i++) {
        const del = await db.waitGame.deleteMany({
            where: {
                clubid,
                point: i,
            },
        });
    }
};

export const pushUpWaitGame = async (clubid: number, point: number) => {
    const upGame = await db.waitGame.updateMany({
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

export const createMatch = async (clubid: number, p1: number, p2: number, p3: number, p4: number, winner: number[]) => {
    const match = await db.match.create({
        data: {
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
