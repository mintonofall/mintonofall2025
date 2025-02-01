"use server";

import db from "@/lib/db";

export async function handleForm(_: unknown, formData: FormData) {
    const pushData = [];
    for (let i = 0; i < 10; i++) {
        const name = formData.get(`name${i + 1}`) as string;
        const gender = formData.get(`gender${i + 1}`) as string;
        const grade = formData.get(`grade${i + 1}`) as string;
        let avater = "";
        const clubid = Number(formData.get("clubid"));
        if (name !== "") {
            if (gender === "man") {
                avater = "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/be6818b4-85e3-41cb-e560-65f15f60a900";
            }
            if (gender === "woman") {
                avater = "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/82dae85a-dfe6-4a3c-c6ec-c184046f0500";
            }

            pushData.push({ name, gender, grade, avater, clubid });
        }
    }
    console.log(pushData);
    const result = await db.player.createMany({
        data: pushData,
    });
    console.log(result);
    return result;
}
