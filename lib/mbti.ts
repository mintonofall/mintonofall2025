"use server";

import db from "./db";

export async function saveMbtiResult(userId: number, mbti: string) {
    await db.user.update({
        where: { id: userId },
        data: { mbti },
    });
    return { success: true };
}
