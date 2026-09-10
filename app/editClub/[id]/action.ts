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
    console.log(user);
    const clubName = formdata.get("clubName") as string;
    const clubLocation = formdata.get("clubLocation") as string;
    const howManyCourts = Number(formdata.get("howManyCourts"));
    const newClub = await db.club.update({
        where: {
            id: Number(formdata.get("id")),
        },
        data: {
            clubName,
            clubLocation,
            howManyCourts,
            // users: {
            //     connect: {
            //         id: user!.id,
            //     },
            // },
        },
    });

    // 코트 수가 늘어난 경우, 새로 생긴 코트 번호에 해당하는 GameBoard row가 없으면 생성합니다.
    const existingCourts = await db.gameBoard.findMany({
        where: { clubid: newClub.id },
        select: { CourtNumber: true },
    });
    const existingCourtNumbers = new Set(existingCourts.map((c) => c.CourtNumber));
    const missingCourtNumbers = Array.from({ length: howManyCourts }, (_, i) => i + 1).filter(
        (courtNumber) => !existingCourtNumbers.has(courtNumber),
    );
    if (missingCourtNumbers.length > 0) {
        await db.gameBoard.createMany({
            data: missingCourtNumbers.map((CourtNumber) => ({
                gameid: "0",
                clubid: newClub.id,
                CourtNumber,
                player1id: 12,
                player2id: 12,
                player3id: 12,
                player4id: 12,
            })),
        });
    }

    redirect(`/home/${newClub.id}`);
}
