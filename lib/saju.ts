"use server";

import db from "./db";
import { calculateSaju } from "./sajuCalc";
import type { SajuInput } from "./sajuTypes";

export async function calculateAndSaveSaju(userId: number, input: SajuInput) {
    const result = calculateSaju(input);
    // 음력 2월 29일처럼 그레고리력으로 존재하지 않는 날짜도 있을 수 있어
    // Date 타입 대신 입력한 달력 그대로의 YYYYMMDD 문자열로 저장합니다.
    const rawBirthday = `${input.year}${String(input.month).padStart(2, "0")}${String(input.day).padStart(2, "0")}`;
    await db.user.update({
        where: { id: userId },
        data: {
            saju: result as unknown as object,
            birthday: rawBirthday,
            birthdayCalendarType: input.calendarType,
            birthdayIsLeapMonth: input.calendarType === "lunar" ? (input.isLeapMonth ?? false) : null,
        },
    });
    return result;
}
