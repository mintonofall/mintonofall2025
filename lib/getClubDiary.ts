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
    console.log("clubID from server : ", clubid);
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

export async function makeMatch(
    players: number[],
    userid: number,
    clubid: number,
    winner1id?: number,
    winner2id?: number,
    score1?: number,
    score2?: number,
    startTime?: Date,
    endTime?: Date
) {
    console.log(players, userid, clubid, winner1id, winner2id, score1, score2, startTime, endTime);
    console.log("makeMatch");
    const data = await db.matchDiary.create({
        data: {
            clubid,
            userid,
            players,
            winner1id,
            winner2id,
            score1,
            score2,
            startTime,
            endTime,
        },
    });
    return data;
}
