// /Users/treebird/Desktop/mintonofall2025/app/actions.ts

"use server";

import db from "@/lib/db";
import { createFantasyLeagueOrderList } from "@/lib/orderlist";
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

    // 1. 드래프트 순서(order)와 상태(process)를 먼저 저장합니다.
    await db.fantasyLeague.update({
        where: { id: leagueId },
        data: {
            order: participantIds,
            process: "drafting", // 순서 정하기가 완료되면 상태를 'drafting'으로 변경
            currentUser: 0, // 첫 번째 순서의 사용자 ID를 currentUser에 저장
        },
    });

    // 2. 저장된 order를 기반으로 전체 드래프트 순서 목록(orderList)을 생성합니다.
    await createFantasyLeagueOrderList(leagueId);

    redirect(`/fantasy/draft/${leagueId}`);
}
