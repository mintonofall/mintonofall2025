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
