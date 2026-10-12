"use server";

import db from "./db";
import { calculateSaju } from "./sajuCalc";
import type { SajuInput } from "./sajuTypes";

export async function calculateAndSaveSaju(userId: number, input: SajuInput) {
    const result = calculateSaju(input);
    await db.user.update({
        where: { id: userId },
        data: { saju: result as unknown as object },
    });
    return result;
}
