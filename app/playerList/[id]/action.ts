"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

/**
 * 선수를 삭제합니다. 다만 현재 게임 현황판(코트)에 올라가 있거나 진행 중인 경기(아직 끝나지 않은
 * Match)에 포함되어 있으면, 경기 기록이 꼬이지 않도록 삭제를 막습니다.
 */
export async function deletePlayer(playerId: number, clubId: number) {
    const playerCondition = [
        { player1id: playerId },
        { player2id: playerId },
        { player3id: playerId },
        { player4id: playerId },
    ];

    const [onGameBoard, inActiveMatch] = await Promise.all([
        db.gameBoard.findFirst({
            where: { clubid: clubId, OR: playerCondition },
        }),
        db.match.findFirst({
            where: { clubid: clubId, endTime: null, OR: playerCondition },
        }),
    ]);

    if (onGameBoard || inActiveMatch) {
        return {
            error: "현재 게임 현황판이나 진행 중인 경기에 포함된 선수는 삭제할 수 없습니다. 경기를 종료한 뒤 다시 시도해주세요.",
        };
    }

    await db.player.delete({
        where: { id: playerId },
    });
    revalidatePath(`/playerList/${clubId}`);
    return { success: true as const };
}

/**
 * "이게 나에요" - 선수 프로필을 로그인한 유저와 연결하고, 그 유저 계정에 저장되어 있던
 * MBTI/민턴사주(별자리 포함)/민턴스타일을 그대로 선수 프로필에 복사해 저장합니다.
 * 유저 프로필 사진이 있다면 선수 사진도 그 사진으로 바꿉니다.
 * 한 클럽에는 한 유저당 한 명의 선수만 지정할 수 있으므로, 같은 클럽에서 기존에 지정했던 선수는 자동으로 해제됩니다.
 */
export async function claimPlayerIdentity(userId: number, playerId: number, clubId: number) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { mbti: true, saju: true, style: true, profileImage: true },
    });

    if (!user) {
        return { error: "로그인 정보를 확인할 수 없습니다." };
    }
    if (!user.mbti && !user.saju && !user.style) {
        return {
            error: "아직 MBTI, 민턴사주, 민턴스타일을 하나도 측정하지 않으셨어요. 먼저 하나를 완료한 뒤 다시 시도해주세요.",
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
            style: user.style ?? Prisma.JsonNull,
            avater: user.profileImage ?? undefined,
        },
    });

    revalidatePath(`/playerList/${clubId}`);
    return { success: true as const, player: updated };
}
