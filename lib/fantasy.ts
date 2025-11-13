"use server";

import { GameEvent } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "./db";

export async function getFantasyPlayers(year: number) {
    const data = await db.fantasyPlayer.findMany({
        where: {
            year,
        },
        orderBy: {
            event: "asc",
        },
    });
    return data;
}

export async function createFantasyPlayer(formData: FormData) {
    const data = {
        year: parseInt(formData.get("year") as string, 10),
        name: formData.get("name") as string,
        photo: (formData.get("photo") as string) || "", // 사진은 선택사항
        contry: (formData.get("country") as string) || "", // 국적은 선택사항
        event: formData.get("event") as GameEvent,
        ranking: parseInt(formData.get("ranking") as string, 10),
    };

    if (!data.year || !data.name || !data.event || isNaN(data.ranking)) {
        throw new Error("필수 입력 항목이 누락되었습니다.");
    }

    await db.fantasyPlayer.create({
        data,
    });

    // 선수 목록 페이지 캐시를 초기화하고 해당 페이지로 리디렉션
    revalidatePath("/fantasy/player");
    redirect("/fantasy/player/inputdata");
}

export async function createFantasyGame(formData: FormData) {
    const data = {
        date: new Date(formData.get("date") as string),
        player1Id: parseInt(formData.get("player1Id") as string, 10),
        player2Id: parseInt(formData.get("player2Id") as string, 10),
        gameResult: (formData.get("gameResult") as string).split(",").map((s) => parseInt(s.trim(), 10)),
    };

    if (!data.date || isNaN(data.player1Id) || isNaN(data.player2Id) || data.gameResult.some(isNaN)) {
        throw new Error("필수 입력 항목이 누락되었거나 형식이 잘못되었습니다.");
    }

    if (data.player1Id === data.player2Id) {
        throw new Error("동일한 선수를 선택할 수 없습니다.");
    }

    await db.fantasyGame.create({ data });

    revalidatePath("/fantasy/player/inputresult");
    redirect("/fantasy/player/inputresult");
}
