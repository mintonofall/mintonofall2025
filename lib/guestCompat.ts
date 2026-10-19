"use server";

import db from "./db";
import type { SajuResult } from "./sajuTypes";
import { mbtiCompatibility } from "./mbtiCompat";
import { sajuCompatibility } from "./sajuCompat";
import { zodiacCompatibility } from "./zodiacCompat";
import { GUEST_PLAYER, getGuestSaju } from "./guestPlayer";

export async function getGuestCompatibility(userId: number) {
    const me = await db.user.findUnique({
        where: { id: userId },
        select: { mbti: true, saju: true },
    });

    if (!me) {
        return { error: "로그인 정보를 확인할 수 없습니다." };
    }

    const meSaju = me.saju as unknown as SajuResult | null;
    const guestSaju = getGuestSaju();

    const mbtiResult = me.mbti ? mbtiCompatibility(me.mbti, GUEST_PLAYER.mbti) : null;
    const sajuResult = meSaju ? sajuCompatibility(meSaju, guestSaju) : null;
    const zodiacResult = meSaju?.zodiac ? zodiacCompatibility(meSaju.zodiac, guestSaju.zodiac) : null;

    if (!mbtiResult && !sajuResult && !zodiacResult) {
        return { error: "MBTI나 민턴사주를 측정해야 장수영 선수와의 궁합을 볼 수 있어요." };
    }

    return {
        success: true as const,
        guest: GUEST_PLAYER,
        mbti: mbtiResult ? { myType: me.mbti!, guestType: GUEST_PLAYER.mbti, ...mbtiResult } : null,
        saju: sajuResult
            ? { myElement: meSaju!.baseElement, guestElement: guestSaju.baseElement, ...sajuResult }
            : null,
        zodiac: zodiacResult
            ? { myZodiac: meSaju!.zodiac, guestZodiac: guestSaju.zodiac, ...zodiacResult }
            : null,
    };
}
