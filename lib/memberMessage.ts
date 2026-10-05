"use server";

import db from "@/lib/db";
import { sendSlackNotification } from "@/lib/slack";

export async function createMemberMessage(
    clubid: number,
    userId: number | null,
    userName: string | null,
    message: string,
) {
    if (!message.trim()) {
        return { error: "메시지를 입력해주세요." };
    }

    const club = await db.club.findUnique({ where: { id: clubid }, select: { clubName: true } });

    await db.memberMessage.create({
        data: {
            clubid,
            userId,
            userName,
            message: message.trim(),
        },
    });

    await sendSlackNotification(
        `📩 [${club?.clubName ?? `${clubid}번 클럽`}] ${userName ?? "익명"}님의 요청: ${message.trim()}`,
    );

    return { success: true };
}

export async function getMemberMessages(clubid: number) {
    const messages = await db.memberMessage.findMany({
        where: { clubid },
        orderBy: { createdAt: "desc" },
    });
    return messages;
}

export async function markMemberMessageRead(id: number) {
    await db.memberMessage.update({
        where: { id },
        data: { isRead: true },
    });
}

export async function getMyMemberMessages(clubid: number, userId: number) {
    const messages = await db.memberMessage.findMany({
        where: { clubid, userId },
        orderBy: { createdAt: "desc" },
    });
    return messages;
}

export async function deleteMemberMessage(id: number, userId: number) {
    const message = await db.memberMessage.findUnique({ where: { id } });
    if (!message || message.userId !== userId) {
        return { error: "삭제할 수 없는 메시지입니다." };
    }

    await db.memberMessage.delete({ where: { id } });
    return { success: true };
}
