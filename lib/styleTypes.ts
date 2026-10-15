import type { StyleLetter } from "./styleQuestions";

export interface StyleResult {
    comm: StyleLetter[]; // 5개 문항 응답 (콜 습관, 실수 후 반응, 듀스 접전, 파트너 실수 대처, 패배 직후)
    play: StyleLetter[]; // 5개 문항 응답 (포지션, 랠리 운영, 체력 배분, 템포, 위기 샷)
    calculatedAt: string;
}
