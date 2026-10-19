export interface CompatLayer {
    title: string;
    tag: string;
    score: number;
    description: string;
}

export interface MbtiCompatibilityResult {
    score: number;
    styleTag: string;
    summary: string;
    layers: CompatLayer[];
}

// ---- 주기능·부기능 스택 (표준 융 심리 기능 순서) ----

type FuncLetter = "S" | "N" | "T" | "F";
type Orientation = "i" | "e";
interface CogFunction {
    letter: FuncLetter;
    orientation: Orientation;
}

const FUNCTION_STACK: Record<string, [CogFunction, CogFunction]> = {
    ISTJ: [{ letter: "S", orientation: "i" }, { letter: "T", orientation: "e" }],
    ISFJ: [{ letter: "S", orientation: "i" }, { letter: "F", orientation: "e" }],
    INFJ: [{ letter: "N", orientation: "i" }, { letter: "F", orientation: "e" }],
    INTJ: [{ letter: "N", orientation: "i" }, { letter: "T", orientation: "e" }],
    ISTP: [{ letter: "T", orientation: "i" }, { letter: "S", orientation: "e" }],
    ISFP: [{ letter: "F", orientation: "i" }, { letter: "S", orientation: "e" }],
    INFP: [{ letter: "F", orientation: "i" }, { letter: "N", orientation: "e" }],
    INTP: [{ letter: "T", orientation: "i" }, { letter: "N", orientation: "e" }],
    ESTP: [{ letter: "S", orientation: "e" }, { letter: "T", orientation: "i" }],
    ESFP: [{ letter: "S", orientation: "e" }, { letter: "F", orientation: "i" }],
    ENFP: [{ letter: "N", orientation: "e" }, { letter: "F", orientation: "i" }],
    ENTP: [{ letter: "N", orientation: "e" }, { letter: "T", orientation: "i" }],
    ESTJ: [{ letter: "T", orientation: "e" }, { letter: "S", orientation: "i" }],
    ESFJ: [{ letter: "F", orientation: "e" }, { letter: "S", orientation: "i" }],
    ENFJ: [{ letter: "F", orientation: "e" }, { letter: "N", orientation: "i" }],
    ENTJ: [{ letter: "T", orientation: "e" }, { letter: "N", orientation: "i" }],
};

// ---- 1. 기능쌍 (ST/SF/NF/NT, 40점 비중) ----

type FuncPair = "ST" | "SF" | "NF" | "NT";

function funcPairOf(type: string): FuncPair {
    return `${type[1]}${type[2]}` as FuncPair;
}

function functionPairLayer(typeA: string, typeB: string): CompatLayer {
    const a = funcPairOf(typeA);
    const b = funcPairOf(typeB);
    const title = "기능쌍";

    if (a === b) {
        return {
            title,
            tag: `${a}-${b} · 같은 기능쌍`,
            score: 70,
            description: "소통은 가장 쉽지만 약점이 같이 겹치는 조합이에요.",
        };
    }

    const shareFirst = a[0] === b[0]; // S 또는 N 공유
    const shareSecond = a[1] === b[1]; // T 또는 F 공유

    if (!shareFirst && !shareSecond) {
        return {
            title,
            tag: `${a}-${b} · 정반대 기능쌍`,
            score: 85,
            description:
                "한 명은 데이터와 패턴으로, 한 명은 흐름과 감으로 코트를 읽어요. 초반 호흡은 느려도 서로의 사각지대를 메우며 가장 크게 성장하는 조합이에요.",
        };
    }

    if (shareFirst) {
        const label = a[0] === "S" ? "감각(S) 공유" : "직관(N) 공유";
        return {
            title,
            tag: `${a}-${b} · ${label}`,
            score: 80,
            description: "코트를 읽는 방식이 같아 이동과 콜이 빠르고, 판단 기준은 달라서 서로 보완돼요.",
        };
    }

    const label = a[1] === "F" ? "감정(F) 공유" : "사고(T) 공유";
    const description =
        a[1] === "F"
            ? "파트너를 배려하는 분위기와 실수 후 회복이 좋고, 구체성과 전체 흐름을 서로 채워줘요."
            : "작전과 분석 중심이라 대화가 잘 통하지만, 감정을 다독이는 부분은 약한 편이에요.";
    return { title, tag: `${a}-${b} · ${label}`, score: 75, description };
}

// ---- 2. 인지기능 축 (주기능·부기능 보완 여부, 25점 비중) ----

type PairResult = "complement" | "same" | "none";

function evaluateFunctionPair(fA: CogFunction, fB: CogFunction): PairResult {
    if (fA.letter !== fB.letter) return "none";
    return fA.orientation !== fB.orientation ? "complement" : "same";
}

function cogFunctionLayer(typeA: string, typeB: string): CompatLayer {
    const [domA, auxA] = FUNCTION_STACK[typeA];
    const [domB, auxB] = FUNCTION_STACK[typeB];

    const domResult = evaluateFunctionPair(domA, domB);
    const auxResult = evaluateFunctionPair(auxA, auxB);

    let score = 40;
    score += domResult === "complement" ? 20 : domResult === "same" ? 10 : 0;
    score += auxResult === "complement" ? 20 : auxResult === "same" ? 10 : 0;
    score = Math.min(100, score);

    const complementCount = [domResult, auxResult].filter((r) => r === "complement").length;
    const sameCount = [domResult, auxResult].filter((r) => r === "same").length;

    const title = "인지기능 축";
    let tag: string;
    let description: string;

    if (complementCount === 2) {
        tag = "주기능·부기능 모두 보완 짝";
        description =
            "주기능과 부기능이 둘 다 서로 다른 성향(내향·외향)의 짝을 이뤄서, 콜과 작전을 주고받는 호흡이 가장 좋아요.";
    } else if (complementCount === 1 && sameCount === 1) {
        tag = "보완 짝 1개 + 동일 기능 1개";
        description = "한쪽은 서로 다른 성향으로 보완하고 한쪽은 똑같은 기능을 공유해서, 편안하면서도 서로를 채워줘요.";
    } else if (complementCount === 1) {
        tag = "보완 짝 1개";
        description = "주기능이나 부기능 중 한쪽이 서로 다른 성향으로 보완돼서, 어느 정도 호흡이 맞는 편이에요.";
    } else if (sameCount === 2) {
        tag = "주기능·부기능 모두 동일 기능 공유";
        description = "같은 기능을 공유해서 편하게 소통할 수 있지만, 새로운 자극은 적은 편이에요.";
    } else if (sameCount === 1) {
        tag = "동일 기능 1개";
        description = "일부 기능을 공유해서 소통이 편한 면이 있지만, 나머지는 서로 맞춰가야 해요.";
    } else {
        tag = "짝도 공유도 없음";
        description = "주기능과 부기능이 서로 다른 영역이라, 콜과 작전을 맞추는 데 시간이 좀 걸릴 수 있어요.";
    }

    return { title, tag, score, description };
}

// ---- 3. J/P 조합 (작전·로테이션 합의 속도, 20점 비중) ----

function jpLayer(typeA: string, typeB: string): CompatLayer {
    const jpA = typeA[3];
    const jpB = typeB[3];
    const title = "J/P 조합";

    if (jpA === "J" && jpB === "J") {
        return {
            title,
            tag: "J-J",
            score: 90,
            description: "작전과 로테이션 합의가 가장 빠르고, 약속한 포지션을 잘 지키는 조합이에요.",
        };
    }
    if (jpA === "P" && jpB === "P") {
        return {
            title,
            tag: "P-P",
            score: 60,
            description: "유연하지만 작전 결정이 미뤄져서 경기 중 혼선이 생길 수 있어요.",
        };
    }
    return {
        title,
        tag: "J-P",
        score: 75,
        description: "계획형이 작전을 잡고 즉흥형이 변칙에 대응하지만, 사전 합의가 필요한 조합이에요.",
    };
}

// ---- 4. 사분면 (활동 에너지·템포, 15점 비중) ----

function quadrantLayer(typeA: string, typeB: string): CompatLayer {
    const quadA = `${typeA[0]}${typeA[1]}`;
    const quadB = `${typeB[0]}${typeB[1]}`;
    const title = "사분면";

    if (quadA === quadB) {
        return {
            title,
            tag: `${quadA}-${quadB} · 동일`,
            score: 100,
            description: "활동 에너지와 경기 템포가 비슷해서 합을 맞추기 편한 조합이에요.",
        };
    }
    const shared = quadA[0] === quadB[0] || quadA[1] === quadB[1];
    if (shared) {
        return {
            title,
            tag: `${quadA}-${quadB} · 한 글자 공유`,
            score: 70,
            description: "활동 에너지나 템포 중 한쪽은 비슷해서 적당히 맞춰갈 수 있는 조합이에요.",
        };
    }
    return {
        title,
        tag: `${quadA}-${quadB} · 공유 없음`,
        score: 40,
        description: "활동 에너지와 경기 템포가 많이 달라서, 서로 맞추는 연습이 필요한 조합이에요.",
    };
}

// ---- 종합 ----

const WEIGHT = { funcPair: 0.4, cog: 0.25, jp: 0.2, quadrant: 0.15 };

function styleTagOf(score: number): string {
    if (score >= 85) return "환상의 복식 케미";
    if (score >= 75) return "손발 잘 맞는 조합";
    if (score >= 65) return "무난한 조합";
    return "맞춰가야 하는 조합";
}

/**
 * MBTI 궁합을 복식 파트너로서의 호흡 기준으로 계산합니다. 네 글자를 단순 비교하지 않고
 * 기능쌍(40%)·인지기능 축(25%)·J/P 조합(20%)·사분면(15%) 네 층을 가중 합산합니다.
 * 실제 승률은 반영하지 않고 MBTI만으로 점수를 냅니다.
 */
export function mbtiCompatibility(typeA: string, typeB: string): MbtiCompatibilityResult {
    const a = typeA.toUpperCase();
    const b = typeB.toUpperCase();

    const funcPair = functionPairLayer(a, b);
    const cog = cogFunctionLayer(a, b);
    const jp = jpLayer(a, b);
    const quadrant = quadrantLayer(a, b);

    const weighted =
        funcPair.score * WEIGHT.funcPair + cog.score * WEIGHT.cog + jp.score * WEIGHT.jp + quadrant.score * WEIGHT.quadrant;
    const score = Math.round(weighted);
    const styleTag = styleTagOf(score);
    const summary = `${styleTag} · ${funcPair.description}`;

    return { score, styleTag, summary, layers: [funcPair, cog, jp, quadrant] };
}
