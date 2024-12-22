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
    prevState: any,
    formdata: FormData
) {
    const user = await getUser();
    const clubName = formdata.get("clubName") as string;
    const clubLocation = formdata.get("clubLocation") as string;
    const club = await db.club.create({
        data: {
            clubName,
            clubLocation,
            users: {
                connect: {
                    id: user!.id,
                },
            },
        },
    });
    redirect("/home");
}
