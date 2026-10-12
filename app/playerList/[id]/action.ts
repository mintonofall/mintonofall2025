"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { calculateSaju } from "@/lib/sajuCalc";

export async function deletePlayer(playerId: number, clubId: number) {
    await db.player.delete({
        where: { id: playerId },
    });
    revalidatePath(`/playerList/${clubId}`);
}

export interface ClaimPlayerInput {
    mbti: string | null;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    calendarType: "solar" | "lunar";
    isLeapMonth: boolean;
    hour: number | null;
}

/**
 * "이게 나에요" - 선수 프로필을 로그인한 유저와 연결하고, 그 유저의 MBTI/생일로 계산한 사주를 저장합니다.
 * 한 클럽에는 한 유저당 한 명의 선수만 지정할 수 있으므로, 같은 클럽에서 기존에 지정했던 선수는 자동으로 해제됩니다.
 */
export async function claimPlayerIdentity(userId: number, playerId: number, clubId: number, input: ClaimPlayerInput) {
    let sajuResult;
    try {
        sajuResult = calculateSaju({
            calendarType: input.calendarType,
            year: input.birthYear,
            month: input.birthMonth,
            day: input.birthDay,
            isLeapMonth: input.isLeapMonth,
            hour: input.hour,
        });
    } catch {
        return { error: "생년월일을 다시 확인해주세요. (존재하지 않는 날짜일 수 있어요)" };
    }

    await db.player.updateMany({
        where: { clubid: clubId, linkedUserId: userId, NOT: { id: playerId } },
        data: { linkedUserId: null },
    });

    const updated = await db.player.update({
        where: { id: playerId },
        data: {
            linkedUserId: userId,
            mbti: input.mbti,
            birthYear: input.birthYear,
            birthMonth: input.birthMonth,
            birthDay: input.birthDay,
            birthCalendarType: input.calendarType,
            birthIsLeapMonth: input.isLeapMonth,
            birthHour: input.hour,
            saju: sajuResult as unknown as object,
        },
    });

    revalidatePath(`/playerList/${clubId}`);
    return { success: true as const, player: updated };
}
