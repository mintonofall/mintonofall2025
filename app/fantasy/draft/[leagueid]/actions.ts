"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { broadcastDraftUpdate } from "@/lib/getUserGoHome";

export async function draftPlayer(
    leagueId: number,
    playerId: number,
    userId: number,
    event: string,
    isWildcardPick: boolean = false
) {
    const league = await db.fantasyLeague.findUnique({
        where: { id: leagueId },
        include: {
            participants: true,
        },
    });

    if (!league || league.orderList[league.currentUser!] !== userId) {
        throw new Error("드래프트 순서가 아니거나 리그를 찾을 수 없습니다.");
    }

    // 사용자의 다음 빈 드래프트 슬롯 찾기
    const userDrafts = await db.draftPick.findMany({
        where: {
            leagueId,
            userId,
        },
    });

    const draftCategories = ["MS", "WS", "MD", "WD", "XD", "와일드카드"];
    const draftedCategories = userDrafts.map((d) => d.category);
    let nextCategory = draftCategories.find((c) => !draftedCategories.includes(c));

    if (isWildcardPick) {
        if (draftedCategories.includes("와일드카드")) {
            throw new Error("와일드카드 슬롯이 이미 사용 중입니다.");
        }
        nextCategory = "와일드카드";
    } else if (draftCategories.includes(event) && !draftedCategories.includes(event)) {
        // 종목이 정해진 선수는 해당 카테고리로
        nextCategory = event;
    } else {
        // 그 외의 경우 (이미 해당 종목이 있거나, 종목이 없는 선수)는 빈 슬롯 중 첫번째로
    }

    if (!nextCategory) {
        throw new Error("더 이상 드래프트할 수 있는 슬롯이 없습니다.");
    }
    const totalPicks = await db.draftPick.count({
        where: { leagueId },
    });

    await db.draftPick.create({
        data: {
            leagueId,
            userId,
            playerId,
            pickNumber: totalPicks + 1,
            category: nextCategory,
        },
    });

    // 다음 드래프트 순서로 업데이트

    if (totalPicks >= 24) {
        const allDraftPicks = await db.draftPick.findMany({
            where: { leagueId },
        });

        const participants = league.participants;

        for (const participant of participants) {
            const userPicks = allDraftPicks.filter((pick) => pick.userId === participant.id);

            const teamData: { [key: string]: number } = {};
            userPicks.forEach((pick) => {
                switch (pick.category) {
                    case "MS":
                        teamData.msId = pick.playerId;
                        break;
                    case "WS":
                        teamData.wsId = pick.playerId;
                        break;
                    case "MD":
                        teamData.mdId = pick.playerId;
                        break;
                    case "WD":
                        teamData.wdId = pick.playerId;
                        break;
                    case "XD":
                        teamData.xdId = pick.playerId;
                        break;
                    case "와일드카드":
                        teamData.wcId = pick.playerId;
                        break;
                }
            });

            await db.fantasyTeam.create({
                data: {
                    userId: participant.id,
                    fantasyLeagueId: leagueId,
                    ...teamData,
                },
            });
        }

        await db.fantasyLeague.update({
            where: { id: leagueId },
            data: { process: "running 1 round" },
        });
        redirect(`/fantasy/runningLeague/${leagueId}`);
    }

    await db.fantasyLeague.update({
        where: { id: leagueId },
        data: { currentUser: totalPicks + 1 },
    });

    revalidatePath(`/fantasy/draft/${leagueId}`);
    await broadcastDraftUpdate(leagueId);
}
