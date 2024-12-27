"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function handlePlayerCreate(prevState: unknown, formdata: FormData) {
    const name = formdata.get("name") as string | null;
    const age = formdata.get("age") ? Number(formdata.get("age")) : null;
    const grade = formdata.get("grade") as string | null;
    const clubId = formdata.get("clubId") ? Number(formdata.get("clubId")) : null;
    const photo = formdata.get("photo") as string | null;
    const gender = formdata.get("genmder") as string | null;

    if (!name || !age || !grade || !clubId || !photo || !gender) {
        console.error("Invalid form data");
        redirect("/home");
    }

    console.log(name, age, grade, clubId, photo);

    await db.player.create({
        data: {
            name,
            age,
            grade,
            club: {
                connect: {
                    id: clubId,
                },
            },
            avater: photo,
        },
    });

    redirect("/home/1");
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
