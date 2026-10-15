import { ELEMENT_STYLE, type Element, type Pillar, type SajuResult } from "./sajuTypes";

export interface CompatLayer {
    title: string;
    tag: string;
    score: number;
    description: string;
}

export interface SajuCompatibilityResult {
    score: number;
    styleTag: string;
    summary: string;
    layers: CompatLayer[];
}

const GENERATES: Record<Element, Element> = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
const CONTROLS: Record<Element, Element> = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" };

function elementRelation(a: Element, b: Element): "상생" | "비화" | "상극" {
    if (a === b) return "비화";
    if (GENERATES[a] === b || GENERATES[b] === a) return "상생";
    return "상극";
}

function elementBaseScore(relation: "상생" | "비화" | "상극"): number {
    return relation === "상생" ? 85 : relation === "비화" ? 72 : 55;
}

// ---- 일간(천간) 관계: 오행 상생상극 + 천간합/천간충 ----

const GAN_YANG = new Set(["甲", "丙", "戊", "庚", "壬"]);

const GAN_HE: Record<string, { with: string; element: Element }> = {
    甲: { with: "己", element: "토" },
    己: { with: "甲", element: "토" },
    乙: { with: "庚", element: "금" },
    庚: { with: "乙", element: "금" },
    丙: { with: "辛", element: "수" },
    辛: { with: "丙", element: "수" },
    丁: { with: "壬", element: "목" },
    壬: { with: "丁", element: "목" },
    戊: { with: "癸", element: "화" },
    癸: { with: "戊", element: "화" },
};

const GAN_CHONG: Record<string, string> = { 甲: "庚", 庚: "甲", 乙: "辛", 辛: "乙", 丙: "壬", 壬: "丙", 丁: "癸", 癸: "丁" };

function ganRelationLayer(a: Pillar, b: Pillar): CompatLayer {
    const relation = elementRelation(a.ganElement, b.ganElement);
    let score = elementBaseScore(relation);
    let tag: string = relation;
    let description =
        relation === "상생"
            ? "일간끼리 서로 북돋아주는 상생 관계예요. 한쪽이 치고 나가면 다른 쪽이 받쳐줘요."
            : relation === "비화"
              ? "일간의 기운이 같아서 편안하지만, 같은 약점이 겹칠 수 있어요."
              : "일간끼리 부딪히는 상극 관계라 스타일 차이가 큰 편이에요.";

    if (GAN_HE[a.ganHanja]?.with === b.ganHanja) {
        score = Math.min(100, score + 15);
        tag = "천간합";
        description = `일간끼리 합을 이루는 찰떡 조합이에요(${a.ganHangul}+${b.ganHangul} → ${ELEMENT_STYLE[GAN_HE[a.ganHanja].element].name} 기운). 말하지 않아도 합이 척척 맞아요.`;
    } else if (GAN_CHONG[a.ganHanja] === b.ganHanja) {
        score = Math.max(0, score - 15);
        tag = "천간충";
        description = `일간끼리 충돌하는 관계예요(${a.ganHangul}↔${b.ganHangul}). 자존심 대결이 될 수 있지만 그만큼 서로에게 자극제가 돼요.`;
    }

    return { title: "일간관계", tag, score, description };
}

// ---- 일지 관계: 오행 상생상극 + 육합/삼합(반합)/충/형/해/파 ----

const ZHI_LIUHE: Record<string, string> = {
    子: "丑", 丑: "子", 寅: "亥", 亥: "寅", 卯: "戌", 戌: "卯",
    辰: "酉", 酉: "辰", 巳: "申", 申: "巳", 午: "未", 未: "午",
};

const ZHI_CHONG: Record<string, string> = {
    子: "午", 午: "子", 丑: "未", 未: "丑", 寅: "申", 申: "寅",
    卯: "酉", 酉: "卯", 辰: "戌", 戌: "辰", 巳: "亥", 亥: "巳",
};

const ZHI_HAE: Record<string, string> = {
    子: "未", 未: "子", 丑: "午", 午: "丑", 寅: "巳", 巳: "寅",
    卯: "辰", 辰: "卯", 申: "亥", 亥: "申", 酉: "戌", 戌: "酉",
};

const ZHI_PA: Record<string, string> = {
    子: "酉", 酉: "子", 丑: "辰", 辰: "丑", 寅: "亥", 亥: "寅",
    卯: "午", 午: "卯", 巳: "申", 申: "巳", 戌: "未", 未: "戌",
};

const ZHI_XING_PAIRS = new Set([
    "子卯", "卯子", // 무례지형
    "寅巳", "巳寅", "巳申", "申巳", "寅申", "申寅", // 지세지형
    "丑戌", "戌丑", "戌未", "未戌", "丑未", "未丑", // 무은지형
]);
const ZHI_SELF_XING = new Set(["辰", "午", "酉", "亥"]);

const SANHE_GROUPS: string[][] = [
    ["寅", "午", "戌"], // 화국
    ["申", "子", "辰"], // 수국
    ["巳", "酉", "丑"], // 금국
    ["亥", "卯", "未"], // 목국
];

function sameSanheGroup(a: string, b: string): boolean {
    return SANHE_GROUPS.some((group) => group.includes(a) && group.includes(b) && a !== b);
}

function zhiRelationLayer(a: Pillar, b: Pillar): CompatLayer {
    const relation = elementRelation(a.zhiElement, b.zhiElement);
    let score = elementBaseScore(relation);
    let tag: string = relation;
    let description =
        relation === "상생"
            ? "일지 오행이 서로 북돋는 관계라 속궁합이 괜찮은 편이에요."
            : relation === "비화"
              ? "일지 오행이 같아서 생활 리듬이 편안하게 맞아요."
              : "일지 오행이 부딪혀 평소 코트 위 취향 차이가 있을 수 있어요.";

    const myZhi = a.zhiHanja;
    const partnerZhi = b.zhiHanja;

    if (ZHI_CHONG[myZhi] === partnerZhi) {
        score = Math.max(0, score - 18);
        tag = "지지충";
        description = `일지끼리 충돌해요(${a.zhiHangul}↔${b.zhiHangul}). 평소엔 안 맞아 보여도 코트 위 팽팽한 긴장감이 의외의 시너지가 되기도 해요.`;
    } else if (ZHI_LIUHE[myZhi] === partnerZhi) {
        score = Math.min(100, score + 15);
        tag = "지지육합";
        description = `일지끼리 육합을 이뤄요(${a.zhiHangul}+${b.zhiHangul}). 속궁합이라 불리는 호흡이 잘 맞는 조합이에요.`;
    } else if (ZHI_XING_PAIRS.has(myZhi + partnerZhi) || (myZhi === partnerZhi && ZHI_SELF_XING.has(myZhi))) {
        score = Math.max(0, score - 10);
        tag = "지지형";
        description = "일지끼리 형(刑) 관계예요. 서로 신경을 긁을 수 있지만 그만큼 서로를 단련시키는 자극이 되기도 해요.";
    } else if (sameSanheGroup(myZhi, partnerZhi)) {
        score = Math.min(100, score + 8);
        tag = "지지반합";
        description = `일지가 삼합의 일부를 이루는 반합 관계예요(${a.zhiHangul}+${b.zhiHangul}). 은근히 합이 맞는 조합이에요.`;
    } else if (ZHI_HAE[myZhi] === partnerZhi) {
        score = Math.max(0, score - 6);
        tag = "지지해";
        description = "일지끼리 해(害) 관계라 사소한 오해가 생기기 쉬워요. 대화로 잘 풀면 괜찮아요.";
    } else if (ZHI_PA[myZhi] === partnerZhi) {
        score = Math.max(0, score - 6);
        tag = "지지파";
        description = "일지끼리 파(破) 관계라 평소 루틴이나 템포가 살짝 어긋날 수 있어요.";
    }

    return { title: "일지관계", tag, score, description };
}

// ---- 십성교차: 상대가 나에게 어떤 역할인지 ----

type TenGod = "비견" | "겁재" | "식신" | "상관" | "편재" | "정재" | "편관" | "정관" | "편인" | "정인";

function tenGodOf(meElement: Element, meYang: boolean, targetElement: Element, targetYang: boolean): TenGod {
    const sameYinYang = meYang === targetYang;
    if (targetElement === meElement) return sameYinYang ? "비견" : "겁재";
    if (GENERATES[targetElement] === meElement) return sameYinYang ? "편인" : "정인";
    if (GENERATES[meElement] === targetElement) return sameYinYang ? "식신" : "상관";
    if (CONTROLS[meElement] === targetElement) return sameYinYang ? "편재" : "정재";
    return sameYinYang ? "편관" : "정관";
}

const TEN_GOD_INFO: Record<TenGod, { group: string; roleLabel: string; roleDesc: string; score: number }> = {
    비견: { group: "비겁", roleLabel: "동료형", roleDesc: "같은 스타일이라 손발은 잘 맞지만, 같은 약점이 겹칠 수 있는 동료 같은 관계예요.", score: 76 },
    겁재: { group: "비겁", roleLabel: "라이벌형", roleDesc: "비슷한 스타일이지만 미묘하게 승부욕이 부딪히는 라이벌 같은 관계예요.", score: 68 },
    식신: { group: "식상", roleLabel: "공격 리드형", roleDesc: "내가 편하게 풀어주는 상대라 템포를 리드하기 좋은, 공격을 주도하는 관계예요.", score: 86 },
    상관: { group: "식상", roleLabel: "과감한 리드형", roleDesc: "내 플레이를 거침없이 끌어내는 상대라 파격적인 공격이 나오는 관계예요.", score: 82 },
    편재: { group: "재성", roleLabel: "운영형", roleDesc: "내가 코스를 만들어주는 상대라, 내가 운영을 주도하는 관계예요.", score: 84 },
    정재: { group: "재성", roleLabel: "안정 운영형", roleDesc: "내가 안정적으로 코스를 만들어주는 상대라 믿고 맡기는 관계예요.", score: 88 },
    편관: { group: "관성", roleLabel: "압박형", roleDesc: "나를 긴장하게 만드는 상대라 부담스러울 수 있지만 그만큼 실력이 느는 관계예요.", score: 62 },
    정관: { group: "관성", roleLabel: "규율형", roleDesc: "나를 다잡아주는 상대라 믿음직하지만 가끔은 답답하게 느껴질 수 있는 관계예요.", score: 74 },
    편인: { group: "인성", roleLabel: "즉흥 서포트형", roleDesc: "나를 챙겨주는 상대라 편하지만, 가끔은 의존하게 되는 관계예요.", score: 80 },
    정인: { group: "인성", roleLabel: "서포트형", roleDesc: "나를 든든하게 받쳐주는 상대라 안정감 있는 관계예요.", score: 90 },
};

function tenGodLayer(myDay: Pillar, partnerDay: Pillar): CompatLayer {
    const meYang = GAN_YANG.has(myDay.ganHanja);
    const targetYang = GAN_YANG.has(partnerDay.ganHanja);
    const god = tenGodOf(myDay.ganElement, meYang, partnerDay.ganElement, targetYang);
    const info = TEN_GOD_INFO[god];
    return {
        title: "십성교차",
        tag: `${god} · ${info.roleLabel}`,
        score: info.score,
        description: `나에게 상대는 '${god}'에 해당해요. ${info.roleDesc}`,
    };
}

// ---- 오행보완도: 서로의 부족한 오행을 채워주는지 ----

function elementBalanceLayer(a: SajuResult, b: SajuResult): CompatLayer {
    let score = 60;
    let hasBonus = false;
    let hasPenalty = false;
    const notes: string[] = [];
    if (b.dominantElement === a.weakestElement) {
        score += 20;
        hasBonus = true;
        notes.push(`상대의 강점(${ELEMENT_STYLE[b.dominantElement].name})이 내 부족한 오행을 채워줘요`);
    }
    if (a.dominantElement === b.weakestElement) {
        score += 20;
        hasBonus = true;
        notes.push(`내 강점(${ELEMENT_STYLE[a.dominantElement].name})이 상대의 부족한 오행을 채워줘요`);
    }
    if (a.weakestElement === b.weakestElement) {
        score -= 15;
        hasPenalty = true;
        notes.push(`둘 다 ${ELEMENT_STYLE[a.weakestElement].name} 기운이 부족해 같은 약점이 겹쳐요`);
    }
    score = Math.max(0, Math.min(100, score));
    const description = notes.length > 0 ? notes.join(". ") + "." : "서로 특별히 채워주거나 겹치는 부분 없이 평범한 조합이에요.";
    const tag = hasBonus ? "보완 관계" : hasPenalty ? "약점 겹침" : "평범";

    return { title: "오행보완도", tag, score, description };
}

// ---- 월지(계절 기질) 보조 ----

function monthZhiLayer(a: SajuResult, b: SajuResult): CompatLayer {
    const relation = elementRelation(a.pillars.month.zhiElement, b.pillars.month.zhiElement);
    const score = elementBaseScore(relation);
    const description =
        relation === "상생"
            ? "계절 기질(월지)이 서로 잘 통해요."
            : relation === "비화"
              ? "계절 기질(월지)이 비슷해서 편안해요."
              : "계절 기질(월지)이 달라 평소 리듬에 약간의 차이가 있을 수 있어요.";

    return { title: "월지(계절 기질)", tag: relation, score, description };
}

/**
 * 일간관계 25% + 일지관계 20% + 십성교차 20% + 오행보완도 20% + 월지 15% 가중 합산으로
 * 사주 궁합을 층별로 분석합니다.
 */
export function sajuCompatibility(a: SajuResult, b: SajuResult): SajuCompatibilityResult {
    const ganLayer = ganRelationLayer(a.pillars.day, b.pillars.day);
    const zhiLayer = zhiRelationLayer(a.pillars.day, b.pillars.day);
    const tenGod = tenGodLayer(a.pillars.day, b.pillars.day);
    const balance = elementBalanceLayer(a, b);
    const month = monthZhiLayer(a, b);

    const weighted = ganLayer.score * 0.25 + zhiLayer.score * 0.2 + tenGod.score * 0.2 + balance.score * 0.2 + month.score * 0.15;
    const score = Math.round(weighted);

    let styleTag: string;
    if (ganLayer.tag === "천간합" || zhiLayer.tag === "지지육합") {
        styleTag = "찰떡 호흡형";
    } else if (ganLayer.tag === "천간충" || zhiLayer.tag === "지지충") {
        styleTag = "텐션형 조합";
    } else if (balance.score >= 80) {
        styleTag = "상호 보완형";
    } else {
        styleTag = "무난한 조합";
    }

    const summary = `${styleTag} · 나에게 상대는 ${tenGod.tag}이에요.`;

    return { score, styleTag, summary, layers: [ganLayer, zhiLayer, tenGod, balance, month] };
}
