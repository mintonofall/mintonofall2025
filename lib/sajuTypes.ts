import type { ZodiacSign } from "./zodiac";

export type Element = "목" | "화" | "토" | "금" | "수";

export const ELEMENT_STYLE: Record<
    Element,
    { name: string; emoji: string; style: string; description: string; trainingTip: string }
> = {
    화: {
        name: "화(火)",
        emoji: "🔥",
        style: "공격형",
        description: "스매시와 결정구 위주로 승부를 내는 공격적인 플레이",
        trainingTip: "스매시 타이밍과 결정력을 다듬는 연습",
    },
    수: {
        name: "수(水)",
        emoji: "💧",
        style: "수비형",
        description: "유연하게 받아넘기며 상대 실수를 유도하는 수비적인 플레이",
        trainingTip: "리시브와 수비 범위를 넓히는 풋워크 연습",
    },
    토: {
        name: "토(土)",
        emoji: "⛰️",
        style: "랠리형",
        description: "흔들림 없이 랠리를 이어가는 안정적인 플레이",
        trainingTip: "긴 랠리에도 흔들리지 않는 체력과 집중력 훈련",
    },
    금: {
        name: "금(金)",
        emoji: "⚙️",
        style: "기술형",
        description: "드롭과 헤어핀 같은 정교한 기술로 코트를 조율하는 플레이",
        trainingTip: "드롭샷과 헤어핀 정확도를 높이는 세밀한 연습",
    },
    목: {
        name: "목(木)",
        emoji: "🌳",
        style: "성장형",
        description: "꾸준히 체력과 기본기를 쌓아가는 성장형 플레이",
        trainingTip: "기초 체력과 기본 스트로크를 꾸준히 다지는 연습",
    },
};

export interface Pillar {
    ganHanja: string;
    ganHangul: string;
    zhiHanja: string;
    zhiHangul: string;
    ganElement: Element;
    zhiElement: Element;
}

export interface SajuResult {
    pillars: {
        year: Pillar;
        month: Pillar;
        day: Pillar;
        time: Pillar | null;
    };
    elementCounts: Record<Element, number>;
    dominantElement: Element;
    weakestElement: Element;
    baseElement: Element; // 일간(日干) 기준 나의 기본 타입
    zodiac: ZodiacSign;
    solarDate: string; // 양력 생년월일 (YYYY-MM-DD)
    analysis: string;
    calculatedAt: string;
}

export interface SajuInput {
    calendarType: "solar" | "lunar";
    year: number;
    month: number;
    day: number;
    isLeapMonth?: boolean;
    hour?: number | null; // 0~23, null이면 시간 모름
}
