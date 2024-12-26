"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function handlePlayerCreate(prevState: unknown, formdata: FormData) {
    const name = formdata.get("name") as string;
    const age = Number(formdata.get("age")) as number;
    const grade = formdata.get("grade") as string;
    const clubId = Number(formdata.get("clubId")) as number;
    const photo = formdata.get("photo") as string;
    console.log(name, age, grade, clubId, photo);
    await db.player.create({
        data: {
            name,
            age,
            grade,
            club: {
                connect: {
                    id: 1,
                },
            },
            avater: photo,
        },
    });
    redirect("/home/1");

    // Save the player to the database

    // Redirect to the home page
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
