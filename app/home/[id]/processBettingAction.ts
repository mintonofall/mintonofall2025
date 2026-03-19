"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function processBettingResult(gameId: string, winnerIds: number[]) {
    try {
        // 1. gameId (문자열 UUID)를 이용해 Match 테이블의 실제 정수형 id를 찾습니다.
        const match = await prisma.match.findFirst({
            where: { gameid: gameId },
        });

        if (!match) return { success: false, message: "게임을 찾을 수 없습니다." };

        // 2. 해당 게임에 걸린, 아직 처리되지 않은(isProcess: false) 베팅 내역을 모두 가져옵니다.
        const bets = await prisma.betting.findMany({
            where: { gameid: match.id, isProcess: false },
        });

        for (const bet of bets) {
            let isHit = bet.isHit; // 기존 상태 유지
            let reward = 0;
            let isCorrect = false;

            if (winnerIds.length === 0) {
                // 승자를 선택하지 않고 종료한 경우 (무승부, 취소 등)
                isHit = "noDecision";
                reward = bet.betCoast; // 베팅 금액 환불
            } else {
                // 정상적으로 승자가 선택된 경우
                isCorrect =
                    bet.betWinner.length > 0 && bet.betWinner.every((playerId: number) => winnerIds.includes(playerId));

                if (isCorrect) {
                    if (bet.betWinner.length === 1) {
                        reward = bet.betCoast * 2; // 한 명 맞췄을 때 2배
                    } else if (bet.betWinner.length === 2) {
                        reward = bet.betCoast * 3; // 두 명 맞췄을 때 3배
                    }
                }
            }

            // 트랜잭션을 통해 베팅 내역 업데이트와 유저 포인트 지급을 동시에 처리
            await prisma.$transaction(async (tx) => {
                if (reward > 0 && bet.userid) {
                    await tx.user.update({
                        where: { id: bet.userid },
                        data: { point: { increment: reward } },
                    });
                }

                await tx.betting.update({
                    where: { id: bet.id },
                    data: {
                        WinnerIds: winnerIds,
                        isCorrect: isCorrect,
                        isProcess: true,
                        isHit: isHit,
                    },
                });
            });
        }
    } catch (error) {
        console.error("베팅 결과 처리 중 오류 발생:", error);
    }
}
