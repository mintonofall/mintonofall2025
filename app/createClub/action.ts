"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    console.log(session);
    if (session.id) {
        const user = await db.user.findUnique({ where: { id: session.id } });
        return user;
    }
}

export default async function handleClubCreate(
    prevState: unknown, // 'any' 대신 'unknown' 타입 사용
    formdata: FormData
) {
    const user = await getUser();
    const clubName = formdata.get("clubName") as string;
    const clubLocation = formdata.get("clubLocation") as string;
    const howManyCourts = Number(formdata.get("howManyCourts"));
    const newClub = await db.club.create({
        data: {
            clubName,
            clubLocation,
            howManyCourts,
            users: {
                connect: {
                    id: user!.id,
                },
            },
        },
    });
    await db.gameBoard.createMany({
        data: [
            {
                gameid: "0",
                clubid: newClub.id,
                CourtNumber: 1,
                player1id: 12,
                player2id: 12,
                player3id: 12,
                player4id: 12,
            },
            {
                gameid: "0",
                clubid: newClub.id,
                CourtNumber: 2,
                player1id: 12,
                player2id: 12,
                player3id: 12,
                player4id: 12,
            },
            {
                gameid: "0",
                clubid: newClub.id,
                CourtNumber: 3,
                player1id: 12,
                player2id: 12,
                player3id: 12,
                player4id: 12,
            },
            {
                gameid: "0",
                clubid: newClub.id,
                CourtNumber: 4,
                player1id: 12,
                player2id: 12,
                player3id: 12,
                player4id: 12,
            },
        ],
    });
    redirect("/home");
}
