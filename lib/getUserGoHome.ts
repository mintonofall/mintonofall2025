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
    CourtNumber: number
) => {
    const match = await db.gameBoard.create({
        data: {
            clubid,
            player1id,
            player2id,
            player3id,
            player4id,
            CourtNumber,
        },
    });
    return match;
};
