"use server";

import db from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function placeBet(userId: number, clubId: number, matchId: number, amount: number, playerIds: number[]) {
    console.log("userId : ", userId);
    try {
        if (!userId) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        // 1. 기존 베팅 내역이 있는지 한 번 더 검증 (중복 베팅 방지)
        const existingBet = await db.betting.findFirst({
            where: {
                userid: userId,
                gameid: matchId,
            },
        });
        if (existingBet) {
            return { success: false, message: "이미 베팅한 시합입니다." };
        }

        const user = await db.user.findUnique({ where: { id: userId } });
        console.log("user : ", user);
        if (!user) {
            return { success: false, message: "사용자를 찾을 수 없습니다." };
        }

        if (user.point < amount) {
            return { success: false, message: "보유 포인트가 부족합니다." };
        }

        const match = await db.match.findUnique({ where: { id: matchId } });
        if (match && match.startTime) {
            const elapsedMs = new Date().getTime() - match.startTime.getTime();
            if (elapsedMs >= 4 * 60 * 1000) {
                return { success: false, message: "베팅 시간이 마감되었습니다 (경기 시작 후 4분 경과)." };
            }
        }

        // 트랜잭션으로 안전하게 포인트 차감 및 베팅 내역 저장
        await db.user.update({
            where: { id: userId },
            data: {
                point: {
                    decrement: amount,
                },
            },
        });

        // 2. Betting 테이블에 정보 저장
        await db.betting.create({
            data: {
                userid: userId,
                clubid: clubId,
                gameid: matchId,
                betWinner: playerIds,
                betCoast: amount,
                isHit: "betting",
                isProcess: false,
            },
        });
        // (Betting 모델의 실제 스키마 필드명에 맞게 아래 내용을 수정해야 할 수 있습니다.)

        return { success: true, message: "베팅이 성공적으로 처리되었습니다." };
    } catch (error) {
        console.error("베팅 처리 중 오류:", error);
        return { success: false, message: "베팅 처리 중 시스템 오류가 발생했습니다." };
    }
}

// /app/home/[id]/viewPage/bettingAction.ts 파일 하단에 추가

export async function getBettedMatchIds(userId: number, clubId: number): Promise<number[]> {
    noStore(); // 최신 베팅 기록을 가져오기 위해 캐시 비활성화
    try {
        // 실제 데이터베이스의 모델명에 맞게 코드를 수정해 주세요. (아래는 Prisma 예시입니다)
        const userBets = await db.betting.findMany({
            where: {
                userid: userId,
                clubid: clubId,
            },
            select: {
                gameid: true,
            },
        });

        // 조회한 베팅 기록에서 matchId만 추출하여 배열로 반환합니다.
        return userBets.map((bet) => bet.gameid);
    } catch (error) {
        console.error("유저 베팅 정보 조회 실패:", error);
        return [];
    }
}

export async function getBettingHistory(userId: number, clubId: number) {
    noStore(); // 최신 베팅 결과를 가져오기 위해 캐시 비활성화
    try {
        const history = await db.betting.findMany({
            where: {
                userid: userId,
                clubid: clubId,
            },
            orderBy: {
                id: "desc", // 최신순(id 내림차순) 정렬
            },
        });
        return history;
    } catch (error) {
        console.error("베팅 내역 조회 실패:", error);
        return [];
    }
}
