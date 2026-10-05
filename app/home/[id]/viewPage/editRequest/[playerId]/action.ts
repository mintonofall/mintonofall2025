"use server";

import db from "@/lib/db";
import { sendSlackNotification } from "@/lib/slack";

export async function createPlayerEditRequest(prevState: unknown, formData: FormData) {
    const playerId = Number(formData.get("playerId"));
    const clubId = Number(formData.get("clubId"));
    const name = (formData.get("name") as string | null) || null;
    const age = formData.get("age") ? Number(formData.get("age")) : null;
    const grade = (formData.get("grade") as string | null) || null;
    const gender = (formData.get("gender") as string | null) || null;
    const photo = (formData.get("photo") as string | null) || null;
    const message = (formData.get("message") as string | null) || null;

    if (!playerId || !clubId) {
        return { error: "잘못된 요청입니다." };
    }

    const [club, player] = await Promise.all([
        db.club.findUnique({ where: { id: clubId }, select: { clubName: true } }),
        db.player.findUnique({ where: { id: playerId }, select: { name: true } }),
    ]);

    await db.playerEditRequest.create({
        data: {
            playerId,
            clubid: clubId,
            name,
            age,
            grade,
            gender,
            photo,
            message,
        },
    });

    await sendSlackNotification(
        `✏️ [${club?.clubName ?? `${clubId}번 클럽`}] "${player?.name ?? `선수 #${playerId}`}" 선수 정보 수정 요청이 등록되었습니다. 클럽 설정 페이지에서 승인해주세요.`,
    );

    return { success: true };
}

export async function getUploadURL() {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
            },
        },
    );
    const data = await response.json();
    return data;
}
