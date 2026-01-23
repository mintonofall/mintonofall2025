"use server";

import { PrismaClient } from "@prisma/client";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createDogGame(playerIds: number[]) {
    try {
        const game = await prisma.dogGames.create({
            data: {
                Players: playerIds,
                WinPlayer: [],
            },
        });

        for (const playerId of playerIds) {
            await prisma.dogPlayer.update({
                where: { id: playerId },
                data: {
                    gameNum: { increment: 1 },
                    games: { push: game.id },
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function deleteDogGame(gameId: number) {
    try {
        // 1. 삭제할 게임 정보 조회 (참여 선수 확인용)
        const game = await db.dogGames.findUnique({
            where: { id: gameId },
            select: { Players: true },
        });

        if (!game) {
            return { success: false, message: "게임을 찾을 수 없습니다." };
        }

        // 2. 참여 선수들의 기록 업데이트 (게임 수 감소 및 게임 ID 제거)
        for (const playerId of game.Players) {
            const player = await db.dogPlayer.findUnique({
                where: { id: playerId },
                select: { games: true },
            });

            if (player) {
                const newGames = player.games.filter((id) => id !== gameId);
                await db.dogPlayer.update({
                    where: { id: playerId },
                    data: {
                        gameNum: { decrement: 1 },
                        games: newGames,
                    },
                });
            }
        }

        // 3. 게임 삭제
        await db.dogGames.delete({
            where: { id: gameId },
        });

        // 4. 관련 페이지 갱신
        revalidatePath("/gametable/game-results");
        revalidatePath("/gametable/game-plan");
        revalidatePath("/gametable/player-list");

        return { success: true };
    } catch (error) {
        console.error("Delete game error:", error);
        return { success: false, message: "게임 삭제 중 오류가 발생했습니다." };
    }
}

export async function getTodayGames(playerIds: number[]) {
    try {
        // 한국 시간(KST) 기준 오늘 날짜 범위 계산
        const now = new Date();
        const utc = now.getTime();
        const KST_OFFSET = 9 * 60 * 60 * 1000;
        const kstTimestamp = utc + KST_OFFSET;
        const kstDate = new Date(kstTimestamp);

        kstDate.setUTCHours(0, 0, 0, 0);
        const startOfToday = new Date(kstDate.getTime() - KST_OFFSET);

        kstDate.setUTCHours(23, 59, 59, 999);
        const endOfToday = new Date(kstDate.getTime() - KST_OFFSET);

        const games = await db.dogGames.findMany({
            where: {
                Players: {
                    hasEvery: playerIds,
                },
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
            orderBy: {
                id: "desc",
            },
        });

        const allPlayerIds = Array.from(new Set(games.flatMap((g) => g.Players)));
        const players = await db.dogPlayer.findMany({
            where: { id: { in: allPlayerIds } },
            select: { id: true, name: true },
        });
        const playerMap = new Map(players.map((p) => [p.id, p.name]));

        return games.map((g) => ({
            id: g.id,
            players: g.Players.map((pid) => playerMap.get(pid) || "Unknown") as string[],
            createdAt: g.createdAt,
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}
