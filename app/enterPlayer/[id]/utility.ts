"use server";

import db from "@/lib/db";

export async function checkName(name: string, clubid: number) {
    const data = await db.player.findMany({
        where: {
            name,
            clubid,
        },
    });
    return data;
}
