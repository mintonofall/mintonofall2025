import type { MatchDiary, PlayerDiary } from "@prisma/client";

// PlayerDiary 타입을 외부로 export하여 일관성 있게 사용
export type { PlayerDiary };

// getMatch 함수의 반환 타입을 명확히 하기 위한 인터페이스
// Prisma의 MatchDiary에 players, winner1, winner2 필드가 PlayerDiary 객체로 채워진 형태
export type MatchDiaryWithPlayers = Omit<MatchDiary, "players"> & {
    players: PlayerDiary[];
    winner1: PlayerDiary | null;
    winner2: PlayerDiary | null;
};
