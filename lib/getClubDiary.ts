"use server";
import db from "./db";

export async function getClubDiary(clubid: number) {
    const data = await db.clubDiary.findMany({
        where: {
            userid: clubid,
        },
    });
    return data;
}

export async function getPlayersFromClub(clubid: number) {
    const data = await db.playerDiary.findMany({
        where: {
            clubid: clubid,
        },
        select: {
            name: true,
            id: true,
            grade: true,
            gender: true,
            age: true,
            avater: true,
            mmr: true,
            clubid: true,
            isMe: true,
        },
        orderBy: {
            isMe: "desc",
        },
    });
    return data;
}
