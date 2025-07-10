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
            userid: clubid,
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
            lastGameDate: true,
        },
        orderBy: [
            {
                isMe: "desc",
            },
            {
                lastGameDate: {
                    sort: "desc",
                    nulls: "last",
                },
            },
        ],
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

    await Promise.all(
        players.map(async (playerId) => {
            await db.playerDiary.update({
                where: {
                    id: playerId,
                },
                data: { lastGameDate: new Date() },
            });
        })
    );

    return data;
}

export async function getWin(userid: number) {
    const datas = await db.matchDiary.findMany({
        where: {
            userid: userid,
        },
    });
    let [wins, loses, point, loss] = [0, 0, 0, 0];
    const meid = await db.playerDiary.findFirst({
        where: {
            userid: userid,
            isMe: true,
        },
        select: {
            id: true,
        },
    });

    if (!meid) {
        return [0, 0];
    }
    if (meid) {
        datas.forEach((data) => {
            //승패 계산기
            if (data.winner1id == meid.id || data.winner2id == meid.id) {
                wins = wins + 1;
                if (data.players[0] == meid.id || data.players[1] == meid.id) {
                    if (data.score1) {
                        point = point + data.score1;
                    }
                } else {
                    if (data.score2) {
                        point = point + data.score2;
                    }
                }
            } else if (data.players.includes(meid.id)) {
                loses = loses + 1;
                if (data.players[0] == meid.id || data.players[1] == meid.id) {
                    if (data.score1) {
                        loss = loss + data.score1;
                    }
                } else {
                    if (data.score2) {
                        loss = loss + data.score2;
                    }
                }
            }
        });
    }

    const result = [wins, loses, point, loss];
    return result;
}

export async function getMatch(userid: number) {
    console.log("userid : ", userid);
    const datas = await db.matchDiary.findMany({
        where: {
            userid: userid,
        },
        orderBy: {
            createat: "desc",
        },
    });
    const result = await Promise.all(
        datas.map(async (data) => {
            const players = await Promise.all(
                data.players.map(async (playerId) => {
                    return await db.playerDiary.findFirst({
                        where: {
                            id: playerId,
                        },
                    });
                })
            );

            const winner1 =
                data.winner1id !== null
                    ? await db.playerDiary.findFirst({
                          where: {
                              id: data.winner1id,
                          },
                      })
                    : null;

            const winner2 =
                data.winner2id !== null
                    ? await db.playerDiary.findFirst({
                          where: {
                              id: data.winner2id,
                          },
                      })
                    : null;

            return {
                ...data,
                players,
                winner1,
                winner2,
            };
        })
    );

    return result;
    // const result = (await datas).map(async (data) => {
    //     const player1 = await db.playerDiary.findFirst({
    //         where: {
    //             id: data.players[0],
    //         }});
    //      const player2 = await db.playerDiary.findFirst({
    //         where: {
    //             id: data.players[1],
    //         }});
    //     const player3 = await db.playerDiary.findFirst({
    //         where: {
    //             id: data.players[2],
    //         }});
    //     const player4 = await db.playerDiary.findFirst({
    //         where: {
    //             id: data.players[3],
    //         }});
    //     const winner1 = data.winner1id !== null ? await db.playerDiary.findFirst({
    //         where: {
    //             id: data.winner1id,
    //         }}) : null;
    //     const winner2 = data.winner2id !== null ? await db.playerDiary.findFirst({
    //         where: {
    //             id: data.winner2id,
    //         }}) : null;

    //     })
}
