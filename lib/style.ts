"use server";

import db from "./db";
import { COMM_QUESTIONS, PLAY_QUESTIONS, type StyleLetter } from "./styleQuestions";
import type { StyleResult } from "./styleTypes";

const VALID_LETTERS = new Set(["A", "B", "C", "D"]);

export async function saveStyleResult(userId: number, comm: string[], play: string[]): Promise<StyleResult> {
    if (comm.length !== COMM_QUESTIONS.length || play.length !== PLAY_QUESTIONS.length) {
        throw new Error("답변 개수가 올바르지 않습니다.");
    }
    if (![...comm, ...play].every((v) => VALID_LETTERS.has(v))) {
        throw new Error("올바르지 않은 답변입니다.");
    }

    const result: StyleResult = {
        comm: comm as StyleLetter[],
        play: play as StyleLetter[],
        calculatedAt: new Date().toISOString(),
    };

    await db.user.update({
        where: { id: userId },
        data: { style: result as unknown as object },
    });

    return result;
}
