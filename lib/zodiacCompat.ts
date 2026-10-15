import type { ZodiacSign } from "./zodiac";

type ZodiacElement = "불" | "흙" | "공기" | "물";

const ZODIAC_ELEMENT: Record<ZodiacSign, ZodiacElement> = {
    양자리: "불", 사자자리: "불", 사수자리: "불",
    황소자리: "흙", 처녀자리: "흙", 염소자리: "흙",
    쌍둥이자리: "공기", 천칭자리: "공기", 물병자리: "공기",
    게자리: "물", 전갈자리: "물", 물고기자리: "물",
};

const OPPOSITE_SIGNS: Record<ZodiacSign, ZodiacSign> = {
    양자리: "천칭자리", 천칭자리: "양자리",
    황소자리: "전갈자리", 전갈자리: "황소자리",
    쌍둥이자리: "사수자리", 사수자리: "쌍둥이자리",
    게자리: "염소자리", 염소자리: "게자리",
    사자자리: "물병자리", 물병자리: "사자자리",
    처녀자리: "물고기자리", 물고기자리: "처녀자리",
};

const ELEMENT_PAIR_SCORE: Record<ZodiacElement, Record<ZodiacElement, number>> = {
    불: { 불: 85, 흙: 66, 공기: 92, 물: 55 },
    흙: { 흙: 85, 불: 66, 공기: 65, 물: 92 },
    공기: { 공기: 85, 불: 92, 흙: 65, 물: 70 },
    물: { 물: 85, 흙: 92, 공기: 70, 불: 55 },
};

const ELEMENT_PAIR_DESC: Record<ZodiacElement, Record<ZodiacElement, string>> = {
    불: {
        불: "둘 다 화끈한 공격형이라 템포가 빠르고 박진감 넘치는 경기를 만들어요.",
        흙: "불의 스피드와 흙의 안정감이 섞여 있어 처음엔 템포를 맞추는 데 시간이 걸릴 수 있어요.",
        공기: "불이 공기를 만나 더 활활 타오르듯, 서로의 플레이를 북돋아주는 찰떡 조합이에요.",
        물: "불과 물처럼 스타일이 정반대라 초반엔 안 맞아 보이지만, 맞춰가면 의외의 반전 매력이 있어요.",
    },
    흙: {
        불: "불의 스피드와 흙의 안정감이 섞여 있어 처음엔 템포를 맞추는 데 시간이 걸릴 수 있어요.",
        흙: "둘 다 꾸준하고 안정적인 스타일이라 흔들림 없는 랠리를 이어가요.",
        공기: "흙의 꾸준함과 공기의 변화무쌍함이 부딪혀 서로 답답하게 느껴질 수 있어요.",
        물: "흙이 물을 머금듯, 서로를 든든하게 받쳐주는 안정적인 조합이에요.",
    },
    공기: {
        불: "불이 공기를 만나 더 활활 타오르듯, 서로의 플레이를 북돋아주는 찰떡 조합이에요.",
        흙: "흙의 꾸준함과 공기의 변화무쌍함이 부딪혀 서로 답답하게 느껴질 수 있어요.",
        공기: "둘 다 재치 있고 변칙적인 플레이를 즐겨서 코트 위에서 호흡이 잘 통해요.",
        물: "공기의 변칙성과 물의 유연함이 만나 묘하게 신선한 조합이 나와요.",
    },
    물: {
        불: "불과 물처럼 스타일이 정반대라 초반엔 안 맞아 보이지만, 맞춰가면 의외의 반전 매력이 있어요.",
        흙: "흙이 물을 머금듯, 서로를 든든하게 받쳐주는 안정적인 조합이에요.",
        공기: "공기의 변칙성과 물의 유연함이 만나 묘하게 신선한 조합이 나와요.",
        물: "둘 다 유연하고 섬세한 수비형이라 끈질긴 랠리에 강해요.",
    },
};

export interface ZodiacCompatibilityResult {
    score: number;
    tag: string;
    description: string;
}

/**
 * 4원소(불/흙/공기/물) 상성과 대칭(정반대) 별자리 여부로 별자리 궁합을 계산합니다.
 */
export function zodiacCompatibility(a: ZodiacSign, b: ZodiacSign): ZodiacCompatibilityResult {
    if (a === b) {
        return {
            score: 88,
            tag: "동일 별자리",
            description: "같은 별자리라 플레이 취향이 비슷해서 편하게 손발을 맞출 수 있어요.",
        };
    }

    const ea = ZODIAC_ELEMENT[a];
    const eb = ZODIAC_ELEMENT[b];
    let score = ELEMENT_PAIR_SCORE[ea][eb];
    let tag = `${ea}-${eb} 조합`;
    let description = ELEMENT_PAIR_DESC[ea][eb];

    if (OPPOSITE_SIGNS[a] === b) {
        score = Math.min(100, score + 5);
        tag = "대칭(정반대) 별자리";
        description += " 정반대 별자리라 스타일은 다르지만 서로의 빈 자리를 채워주는 자석 같은 케미가 있어요.";
    }

    return { score, tag, description };
}
