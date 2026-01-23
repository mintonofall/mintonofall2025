"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDogPlayer(formData: FormData) {
    const name = formData.get("name") as string;
    const where = formData.get("where") as string;
    const grade = formData.get("grade") as string;
    const gender = formData.get("gender") as string;

    if (!name) return { success: false, message: "이름을 입력해주세요." };

    try {
        await db.dogPlayer.create({
            data: {
                name,
                where: where || "",
                grade: grade || "",
                gender: gender || "man",
                gameNum: 0,
                games: [],
            },
        });
        revalidatePath("/gametable/player-list");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: "선수 추가 중 오류가 발생했습니다." };
    }
}

export async function updateDogPlayer(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    const where = formData.get("where") as string;
    const grade = formData.get("grade") as string;
    const gender = formData.get("gender") as string;

    if (!name) return { success: false, message: "이름을 입력해주세요." };

    try {
        await db.dogPlayer.update({
            where: { id },
            data: {
                name,
                where: where || "",
                grade: grade || "",
                gender: gender || "man",
            },
        });
        revalidatePath("/gametable/player-list");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: "선수 수정 중 오류가 발생했습니다." };
    }
}

export async function deleteDogPlayer(id: number) {
    try {
        await db.dogPlayer.delete({
            where: { id },
        });
        revalidatePath("/gametable/player-list");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: "선수 삭제 중 오류가 발생했습니다." };
    }
}
