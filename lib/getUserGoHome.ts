"use server";
import { redirect } from "next/navigation";
import db from "./db";
import getSession from "./session";

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
