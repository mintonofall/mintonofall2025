"use server";

import db from "@/lib/db";

export async function handleForm(_: unknown, formData: FormData) {
    const pushData = [];
    const userid = Number(formData.get("userid"));
    for (let i = 0; i < 6; i++) {
        const name = formData.get(`name${i + 1}`) as string;
        const agePre = formData.get(`age${i + 1}`) as string;
        const age = Number(agePre);
        const gender = formData.get(`gender${i + 1}`) as string;
        const grade = formData.get(`grade${i + 1}`) as string;
        let avater = "";
        const clubid = 1;
        if (name !== "") {
            if (gender === "man") {
                avater = "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/be6818b4-85e3-41cb-e560-65f15f60a900";
            }
            if (gender === "woman") {
                avater = "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/82dae85a-dfe6-4a3c-c6ec-c184046f0500";
            }
            if (name) {
                pushData.push({ name, age, gender, grade, avater, userid, clubid, lastGameDate: new Date() });
            }
        }
    }
    console.log(pushData);

    if (pushData.length === 0) {
        return { error: "등록할 선수 이름을 입력해주세요." };
    }

    // 이미 등록된 선수와 이름이 겹치는 항목을 걸러냅니다.
    const names = pushData.map((p) => p.name);
    const existingPlayers = await db.playerDiary.findMany({
        where: { userid, name: { in: names } },
        select: { name: true },
    });
    const existingNames = new Set(existingPlayers.map((p) => p.name));

    // 입력한 폼 안에서 중복된 이름(두 번째 이후 항목)과 이미 등록된 이름을 등록 대상에서 제외합니다.
    const seenNames = new Set<string>();
    const skippedNames: string[] = [];
    const validData = pushData.filter((p) => {
        if (existingNames.has(p.name) || seenNames.has(p.name)) {
            skippedNames.push(p.name);
            return false;
        }
        seenNames.add(p.name);
        return true;
    });

    if (validData.length > 0) {
        const result = await db.playerDiary.createMany({
            data: validData,
        });
        console.log(result);
    }

    if (validData.length === 0) {
        return { error: `중복된 이름이라 등록된 선수가 없습니다: ${skippedNames.join(", ")}` };
    }

    return { success: true, registeredCount: validData.length, skippedNames };
}
