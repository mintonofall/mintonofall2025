"use server";

import db from "./db";
import type { SajuResult } from "./sajuTypes";
import type { StyleResult } from "./styleTypes";
import { mbtiCompatibility } from "./mbtiCompat";
import { sajuCompatibility } from "./sajuCompat";
import { zodiacCompatibility } from "./zodiacCompat";
import { commCompatibility, playCompatibility } from "./styleCompat";

export async function getCompatibility(myUserId: number, partnerUserName: string) {
    // 맥/일부 IME에서 한글이 자소분리(NFD)로 입력될 수 있어, DB에 저장된 형태(NFC)로 정규화 후 조회합니다.
    const trimmed = partnerUserName.trim().normalize("NFC");
    if (!trimmed) {
        return { error: "상대방 아이디를 입력해주세요." };
    }

    const [me, partner] = await Promise.all([
        db.user.findUnique({
            where: { id: myUserId },
            select: { id: true, userName: true, nickName: true, mbti: true, saju: true, style: true },
        }),
        db.user.findFirst({
            where: { userName: trimmed },
            select: { id: true, userName: true, nickName: true, mbti: true, saju: true, style: true },
        }),
    ]);

    if (!me) {
        return { error: "로그인 정보를 확인할 수 없습니다." };
    }
    if (!partner) {
        return { error: `"${trimmed}" 아이디의 사용자를 찾을 수 없습니다.` };
    }
    if (partner.id === me.id) {
        return { error: "본인과의 궁합은 측정할 수 없어요." };
    }

    const meSaju = me.saju as unknown as SajuResult | null;
    const partnerSaju = partner.saju as unknown as SajuResult | null;
    const meStyle = me.style as unknown as StyleResult | null;
    const partnerStyle = partner.style as unknown as StyleResult | null;

    const mbtiResult = me.mbti && partner.mbti ? mbtiCompatibility(me.mbti, partner.mbti) : null;
    const sajuResult = meSaju && partnerSaju ? sajuCompatibility(meSaju, partnerSaju) : null;
    const zodiacResult =
        meSaju?.zodiac && partnerSaju?.zodiac ? zodiacCompatibility(meSaju.zodiac, partnerSaju.zodiac) : null;
    const commResult = meStyle && partnerStyle ? commCompatibility(meStyle.comm, partnerStyle.comm) : null;
    const playResult = meStyle && partnerStyle ? playCompatibility(meStyle.play, partnerStyle.play) : null;

    if (!mbtiResult && !sajuResult && !zodiacResult && !commResult && !playResult) {
        return {
            error: `${
                partner.nickName || partner.userName
            }님과의 궁합을 보려면 두 분 모두 MBTI, 민턴사주, 민턴스타일 중 하나는 측정이 필요해요.`,
        };
    }

    const scores = [mbtiResult?.score, sajuResult?.score, zodiacResult?.score, commResult?.score, playResult?.score].filter(
        (s): s is number => typeof s === "number",
    );
    const overallScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

    // 조회한 궁합 기록을 저장합니다 (같은 상대와 다시 보면 점수만 갱신하고, 메모는 유지합니다).
    await db.compatibilityCheck.upsert({
        where: { userId_partnerUserId: { userId: me.id, partnerUserId: partner.id } },
        create: {
            userId: me.id,
            partnerUserId: partner.id,
            partnerUserName: partner.userName,
            overallScore,
            mbtiScore: mbtiResult?.score ?? null,
            sajuScore: sajuResult?.score ?? null,
            zodiacScore: zodiacResult?.score ?? null,
            commScore: commResult?.score ?? null,
            playScore: playResult?.score ?? null,
        },
        update: {
            partnerUserName: partner.userName,
            overallScore,
            mbtiScore: mbtiResult?.score ?? null,
            sajuScore: sajuResult?.score ?? null,
            zodiacScore: zodiacResult?.score ?? null,
            commScore: commResult?.score ?? null,
            playScore: playResult?.score ?? null,
        },
    });

    return {
        success: true as const,
        partnerName: partner.nickName || partner.userName,
        overallScore,
        mbti: mbtiResult ? { myType: me.mbti!, partnerType: partner.mbti!, ...mbtiResult } : null,
        saju: sajuResult
            ? { myElement: meSaju!.baseElement, partnerElement: partnerSaju!.baseElement, ...sajuResult }
            : null,
        zodiac: zodiacResult ? { myZodiac: meSaju!.zodiac, partnerZodiac: partnerSaju!.zodiac, ...zodiacResult } : null,
        comm: commResult,
        play: playResult,
    };
}

export async function getCompatibilityHistory(userId: number) {
    const checks = await db.compatibilityCheck.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        include: { partner: { select: { nickName: true, userName: true } } },
    });

    return checks.map((check) => ({
        id: check.id,
        partnerUserName: check.partner.userName,
        partnerName: check.partner.nickName || check.partner.userName,
        overallScore: check.overallScore,
        mbtiScore: check.mbtiScore,
        sajuScore: check.sajuScore,
        zodiacScore: check.zodiacScore,
        commScore: check.commScore,
        playScore: check.playScore,
        memo: check.memo,
        updatedAt: check.updatedAt.toISOString(),
    }));
}

export async function updateCompatibilityMemo(userId: number, checkId: number, memo: string) {
    const check = await db.compatibilityCheck.findUnique({ where: { id: checkId } });
    if (!check || check.userId !== userId) {
        return { error: "해당 기록을 찾을 수 없습니다." };
    }

    await db.compatibilityCheck.update({
        where: { id: checkId },
        data: { memo: memo.slice(0, 10) },
    });

    return { success: true as const };
}

export async function deleteCompatibilityCheck(userId: number, checkId: number) {
    const check = await db.compatibilityCheck.findUnique({ where: { id: checkId } });
    if (!check || check.userId !== userId) {
        return { error: "해당 기록을 찾을 수 없습니다." };
    }

    await db.compatibilityCheck.delete({ where: { id: checkId } });

    return { success: true as const };
}
