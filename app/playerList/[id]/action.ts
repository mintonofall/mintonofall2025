"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function deletePlayer(playerId: number, clubId: number) {
    await db.player.delete({
        where: { id: playerId },
    });
    revalidatePath(`/playerList/${clubId}`);
}

/**
 * "이게 나에요" - 선수 프로필을 로그인한 유저와 연결하고, 그 유저 계정에 저장되어 있던
 * MBTI/민턴사주를 그대로 선수 프로필에 복사해 저장합니다.
 * 한 클럽에는 한 유저당 한 명의 선수만 지정할 수 있으므로, 같은 클럽에서 기존에 지정했던 선수는 자동으로 해제됩니다.
 */
export async function claimPlayerIdentity(userId: number, playerId: number, clubId: number) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { mbti: true, saju: true },
    });

    if (!user) {
        return { error: "로그인 정보를 확인할 수 없습니다." };
    }
    if (!user.mbti && !user.saju) {
        return {
            error: "아직 MBTI나 민턴사주를 측정하지 않으셨어요. 먼저 MBTI 테스트나 민턴사주를 완료한 뒤 다시 시도해주세요.",
        };
    }

    await db.player.updateMany({
        where: { clubid: clubId, linkedUserId: userId, NOT: { id: playerId } },
        data: { linkedUserId: null },
    });

    const updated = await db.player.update({
        where: { id: playerId },
        data: {
            linkedUserId: userId,
            mbti: user.mbti,
            saju: user.saju ?? Prisma.JsonNull,
        },
    });

    revalidatePath(`/playerList/${clubId}`);
    return { success: true as const, player: updated };
}
