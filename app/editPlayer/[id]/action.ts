"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function handlePlayerEdit(prevState: unknown, formdata: FormData) {
    const name = formdata.get("name") as string | null;
    const age = formdata.get("age") ? Number(formdata.get("age")) : null;
    const grade = formdata.get("grade") as string | null;
    const clubId = formdata.get("clubId") ? Number(formdata.get("clubId")) : null;
    const photo = formdata.get("photo") as string | null;
    const gender = formdata.get("gender") as string | null;
    const playerId = formdata.get("playerId") ? Number(formdata.get("playerId")) : undefined;

    if (!name || !grade || !clubId || !photo || !gender) {
        console.log(name, age, grade, clubId, gender, photo);
        console.error("Invalid form data");
        redirect(`/home/${clubId}`);
    }

    console.log(name, age, grade, clubId, photo, gender, playerId);

    // 클럽 ID가 유효한지 확인
    // const clubExists = await db.club.findUnique({
    //     where: { id: clubId },
    // });

    // if (!clubExists) {
    //     console.error(`Club with id ${clubId} not found`);
    //     redirect("/home/1");
    //     return;
    // }
    if (playerId !== undefined) {
        await db.player.update({
            where: {
                id: playerId,
            },
            data: {
                name,
                age,
                grade,
                avater: photo,
            },
        });
    } else {
        console.error("Invalid player ID");
        redirect("/home/1");
    }

    redirect(`/playerList/${clubId}`);
}

export async function getUploadURL() {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
            },
        }
    );
    const data = await response.json();
    console.log(data);
    return data;
}
