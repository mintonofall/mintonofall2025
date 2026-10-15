export interface CompatLayer {
    title: string;
    tag: string;
    score: number;
    description: string;
}

export interface MbtiCompatibilityResult {
    score: number;
    sameCount: number;
    styleTag: string;
    summary: string;
    layers: CompatLayer[];
}

type DimensionKey = "EI" | "SN" | "TF" | "JP";

interface DimensionOutcome {
    tag: string;
    score: number;
    description: string;
}

const DIMENSION_INFO: Record<
    DimensionKey,
    { title: string; same: Record<string, DimensionOutcome>; diff: DimensionOutcome }
> = {
    EI: {
        title: "에너지 방향 (E/I)",
        same: {
            E: {
                tag: "외향 동일 (E-E)",
                score: 80,
                description: "둘 다 에너지 넘치는 외향형이라 경기 분위기를 화끈하게 띄우는 텐션 폭발형 조합이에요.",
            },
            I: {
                tag: "내향 동일 (I-I)",
                score: 80,
                description: "둘 다 차분한 내향형이라 말이 없어도 눈빛만으로 호흡이 맞는 조용한 집중형 조합이에요.",
            },
        },
        diff: {
            tag: "외향-내향 보완 (E-I)",
            score: 85,
            description: "한쪽은 분위기를 띄우고 한쪽은 차분하게 중심을 잡아주는, 에너지 밸런스가 좋은 보완 조합이에요. E와 I는 반대일수록 오히려 잘 맞는 궁합이에요.",
        },
    },
    SN: {
        title: "인식 방식 (S/N)",
        same: {
            S: {
                tag: "감각 동일 (S-S)",
                score: 82,
                description: "둘 다 현재 상황과 디테일에 강해서 실전 감각으로 척척 맞춰가는 조합이에요.",
            },
            N: {
                tag: "직관 동일 (N-N)",
                score: 78,
                description: "둘 다 큰 그림과 전략을 중시해서 창의적인 작전을 함께 구상하는 조합이에요.",
            },
        },
        diff: {
            tag: "감각-직관 보완 (S-N)",
            score: 88,
            description: "한쪽은 눈앞의 상황을 꼼꼼히 챙기고 한쪽은 전체 흐름과 전략을 그려주는, 현실 감각과 전략이 모두 잡히는 찰떡 보완 조합이에요.",
        },
    },
    TF: {
        title: "판단 기준 (T/F)",
        same: {
            T: {
                tag: "사고 동일 (T-T)",
                score: 80,
                description: "둘 다 논리적이고 솔직해서 효율적으로 피드백을 주고받는 조합이에요.",
            },
            F: {
                tag: "감정 동일 (F-F)",
                score: 78,
                description: "둘 다 서로를 세심하게 배려해서 편안한 분위기를 만드는 조합이에요.",
            },
        },
        diff: {
            tag: "사고-감정 보완 (T-F)",
            score: 86,
            description: "한쪽은 냉철하게 판단하고 한쪽은 팀 분위기와 감정을 챙기는, 판단력과 배려심이 균형 잡힌 조합이에요.",
        },
    },
    JP: {
        title: "생활 양식 (J/P)",
        same: {
            J: {
                tag: "판단 동일 (J-J)",
                score: 82,
                description: "둘 다 계획적이라 루틴과 전략을 착착 맞춰가는 조합이에요.",
            },
            P: {
                tag: "인식 동일 (P-P)",
                score: 72,
                description: "둘 다 즉흥적이고 유연해서 자유로운 플레이가 나오지만, 계획성이 부족해 산만해질 수 있어요.",
            },
        },
        diff: {
            tag: "판단-인식 보완 (J-P)",
            score: 85,
            description: "한쪽이 계획을 세우고 한쪽이 유연하게 대처하는, 구조와 유연함이 모두 갖춰진 조합이에요.",
        },
    },
};

const DIMENSION_ORDER: { key: DimensionKey; index: number }[] = [
    { key: "EI", index: 0 },
    { key: "SN", index: 1 },
    { key: "TF", index: 2 },
    { key: "JP", index: 3 },
];

function dimensionLayer(key: DimensionKey, letterA: string, letterB: string): CompatLayer {
    const info = DIMENSION_INFO[key];
    const outcome = letterA === letterB ? info.same[letterA] : info.diff;
    return { title: info.title, tag: outcome.tag, score: outcome.score, description: outcome.description };
}

/**
 * MBTI 4개 차원을 각각 독립적으로 분석합니다. 같은 글자라고 무조건 좋은 것도,
 * 다른 글자라고 무조건 안 맞는 것도 아니라는 전제로, 차원별로 서로 다른 궁합 해석을 줍니다.
 */
export function mbtiCompatibility(typeA: string, typeB: string): MbtiCompatibilityResult {
    const layers = DIMENSION_ORDER.map(({ key, index }) => dimensionLayer(key, typeA[index], typeB[index]));
    const sameCount = DIMENSION_ORDER.filter(({ index }) => typeA[index] === typeB[index]).length;
    const score = Math.round(layers.reduce((sum, l) => sum + l.score, 0) / layers.length);

    const diffCount = 4 - sameCount;
    const styleTag = diffCount >= 3 ? "상호보완형" : diffCount <= 1 ? "싱크로형" : "밸런스형";

    const summary =
        styleTag === "상호보완형"
            ? "서로 다른 점이 많지만, 다른 성향끼리 빈틈을 채워주는 보완형 조합이에요."
            : styleTag === "싱크로형"
              ? "성향이 비슷해서 말하지 않아도 척척 맞는 싱크로형 조합이에요."
              : "닮은 점과 다른 점이 적절히 섞인 밸런스형 조합이에요.";

    return { score, sameCount, styleTag, summary, layers };
}
