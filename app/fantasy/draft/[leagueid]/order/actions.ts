"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * 드래프트 순서 설정을 위해 리그 정보와 참가자 목록을 가져옵니다.
 * @param leagueId - 판타지 리그의 ID
 */
export async function getLeagueForOrder(leagueId: number) {
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
        },
    });
    return league;
}

/**
 * 결정된 드래프트 순서를 데이터베이스에 저장하고 드래프트 페이지로 이동합니다.
 * @param leagueId - 판타지 리그의 ID
 * @param orderedIds - 순서가 정해진 참가자(User) ID 배열
 */
export async function saveDraftOrder(leagueId: number, orderedIds: number[]) {
    await db.fantasyLeague.update({
        where: { id: leagueId },
        data: {
            currentUser: orderedIds[0],
            process: "드래프트중",
            order: orderedIds,
        },
    });
    redirect(`/fantasy/draft/${leagueId}`);
}
