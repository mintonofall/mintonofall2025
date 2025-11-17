// /Users/treebird/Desktop/mintonofall2025/app/actions.ts

"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

// ... (기존 코드: login, smsLogin, logout, joinLeague)

export async function getLeague(leagueId: number) {
    const league = await db.fantasyLeague.findUnique({
        where: { id: leagueId },
        select: {
            id: true,
            leagueName: true,
            participants: {
                select: {
                    id: true,
                    nickName: true,
                },
            },
            order: true,
        },
    });
    return league;
}

export async function saveDraftOrder(leagueId: number, orderedParticipants: { id: number; nickName: string }[]) {
    const participantIds = orderedParticipants.map((p) => p.id);
    const firstUserId = orderedParticipants.length > 0 ? orderedParticipants[0].id : null;

    await db.fantasyLeague.update({
        where: { id: leagueId },
        data: {
            order: participantIds,
            process: "드래프트중", // 순서 정하기가 완료되면 상태를 '드래프트중'으로 변경
            currentUser: firstUserId, // 첫 번째 순서의 사용자 ID를 currentUser에 저장
        },
    });
    redirect(`/draft/${leagueId}`);
}
