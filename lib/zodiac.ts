export type ZodiacSign =
    | "양자리"
    | "황소자리"
    | "쌍둥이자리"
    | "게자리"
    | "사자자리"
    | "처녀자리"
    | "천칭자리"
    | "전갈자리"
    | "사수자리"
    | "염소자리"
    | "물병자리"
    | "물고기자리";

export const ZODIAC_STYLE: Record<ZodiacSign, { symbol: string; emoji: string; style: string; description: string }> = {
    양자리: {
        symbol: "♈",
        emoji: "🐏",
        style: "저돌적인 스매셔",
        description: "승부욕이 강하고 선제공격을 좋아해요.",
    },
    황소자리: {
        symbol: "♉",
        emoji: "🐂",
        style: "끈기 있는 수비형",
        description: "랠리를 길게 가져가며 상대를 지치게 만들어요.",
    },
    쌍둥이자리: {
        symbol: "♊",
        emoji: "👯",
        style: "변칙적인 플레이메이커",
        description: "드롭샷이나 헤어핀 같은 잔기술에 능해요.",
    },
    게자리: {
        symbol: "♋",
        emoji: "🦀",
        style: "안정적인 파트너 플레이어",
        description: "팀워크를 중시해요.",
    },
    사자자리: {
        symbol: "♌",
        emoji: "🦁",
        style: "화려한 스매시를 즐기는 쇼맨",
        description: "존재감 넘치는 플레이를 보여줘요.",
    },
    처녀자리: {
        symbol: "♍",
        emoji: "🌾",
        style: "정교한 코스 공략형",
        description: "실수를 극도로 싫어하는 완벽주의 스타일이에요.",
    },
    천칭자리: {
        symbol: "♎",
        emoji: "⚖️",
        style: "밸런스 잡힌 올라운더",
        description: "공격과 수비를 고르게 구사해요.",
    },
    전갈자리: {
        symbol: "♏",
        emoji: "🦂",
        style: "집요하고 냉철한 전략가",
        description: "승부에 집중하는 뛰어난 전략가예요.",
    },
    사수자리: {
        symbol: "♐",
        emoji: "🏹",
        style: "자유분방한 공격형",
        description: "거침없이 몰아붙이는 플레이를 즐겨요.",
    },
    염소자리: {
        symbol: "♑",
        emoji: "🐐",
        style: "꾸준히 기본기로 승부하는 정석파",
        description: "탄탄한 기본기로 묵묵히 실력을 쌓아요.",
    },
    물병자리: {
        symbol: "♒",
        emoji: "🏺",
        style: "예측불허의 창의적인 플레이",
        description: "남들과 다른 변칙 플레이를 즐겨요.",
    },
    물고기자리: {
        symbol: "♓",
        emoji: "🐟",
        style: "감각적이고 유연한 몸놀림",
        description: "순발력과 유연성이 강점이에요.",
    },
};

/**
 * 양력 월/일로 서양 별자리를 판정합니다.
 */
export function getZodiacSign(month: number, day: number): ZodiacSign {
    const md = month * 100 + day;
    if (md >= 321 && md <= 419) return "양자리";
    if (md >= 420 && md <= 520) return "황소자리";
    if (md >= 521 && md <= 621) return "쌍둥이자리";
    if (md >= 622 && md <= 722) return "게자리";
    if (md >= 723 && md <= 822) return "사자자리";
    if (md >= 823 && md <= 922) return "처녀자리";
    if (md >= 923 && md <= 1023) return "천칭자리";
    if (md >= 1024 && md <= 1122) return "전갈자리";
    if (md >= 1123 && md <= 1221) return "사수자리";
    if (md >= 1222 || md <= 119) return "염소자리";
    if (md >= 120 && md <= 218) return "물병자리";
    return "물고기자리"; // 2/19 ~ 3/20
}
