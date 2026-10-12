"use server";

import db from "./db";
import { MBTI_LETTER_TRAITS } from "./mbtiQuestions";
import { ELEMENT_STYLE, type Element, type SajuResult } from "./sajuTypes";

function mbtiCompatibility(typeA: string, typeB: string) {
    let sameCount = 0;
    const sameTraits: string[] = [];

    for (let i = 0; i < 4; i++) {
        if (typeA[i] === typeB[i]) {
            sameCount += 1;
            sameTraits.push(MBTI_LETTER_TRAITS[typeA[i]]);
        }
    }

    // 4개 차원 중 일치하는 개수에 비례해 40~100점으로 환산합니다 (일치 0개=40점, 4개=100점).
    const score = 40 + sameCount * 15;

    let description: string;
    if (sameCount === 4) {
        description = "성향이 거의 똑같아서 말하지 않아도 손발이 척척 맞는 편이에요.";
    } else if (sameCount === 0) {
        description = "정반대 성향이라 서로 다른 매력에 끌리지만, 코트 위 호흡은 어느 정도 맞춰가야 해요.";
    } else {
        description = `${sameTraits.join(", ")} 성향은 서로 통해서 편안하고, 나머지는 색깔이 달라 적당한 자극이 되어줘요.`;
    }

    return { score, sameCount, description };
}

const GENERATES: Record<Element, Element> = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };

function elementRelation(a: Element, b: Element): "상생" | "비화" | "상극" {
    if (a === b) return "비화";
    if (GENERATES[a] === b || GENERATES[b] === a) return "상생";
    return "상극";
}

function sajuCompatibility(a: SajuResult, b: SajuResult) {
    const relation = elementRelation(a.baseElement, b.baseElement);
    const baseScore = relation === "상생" ? 90 : relation === "비화" ? 75 : 55;

    // 한쪽의 부족한 오행을 다른 쪽의 강점이 채워준다면 보너스 점수를 더합니다.
    let bonus = 0;
    if (a.weakestElement === b.dominantElement) bonus += 7;
    if (b.weakestElement === a.dominantElement) bonus += 7;
    const score = Math.min(100, baseScore + bonus);

    const aInfo = ELEMENT_STYLE[a.baseElement];
    const bInfo = ELEMENT_STYLE[b.baseElement];

    let description: string;
    if (relation === "상생") {
        description = `${aInfo.name}과 ${bInfo.name}은 서로를 북돋아주는 상생 관계예요. 한쪽이 치고 나가면 다른 쪽이 받쳐주는 찰떡 호흡을 기대할 수 있어요.`;
    } else if (relation === "비화") {
        description = `두 분 다 ${aInfo.name} 기운이라 플레이 스타일이 비슷해요. 편하게 합을 맞출 수 있지만, 같은 약점이 겹칠 수 있으니 주의하세요.`;
    } else {
        description = `${aInfo.name}과 ${bInfo.name}은 부딪히는 상극 관계예요. 스타일 차이가 커서 초반엔 삐걱댈 수 있지만, 맞춰가면 의외의 시너지를 낼 수도 있어요.`;
    }
    if (bonus > 0) {
        description += " 서로의 부족한 부분을 채워주는 조합이라 더 기대돼요.";
    }

    return { score, relation, description };
}

export async function getCompatibility(myUserId: number, partnerUserName: string) {
    const trimmed = partnerUserName.trim();
    if (!trimmed) {
        return { error: "상대방 아이디를 입력해주세요." };
    }

    const [me, partner] = await Promise.all([
        db.user.findUnique({
            where: { id: myUserId },
            select: { id: true, userName: true, nickName: true, mbti: true, saju: true },
        }),
        db.user.findFirst({
            where: { userName: trimmed },
            select: { id: true, userName: true, nickName: true, mbti: true, saju: true },
        }),
    ]);

    if (!me) {
        return { error: "로그인 정보를 확인할 수 없습니다." };
    }
    if (!partner) {
        return { error: `"${trimmed}" 아이디의 사용자를 찾을 수 없습니다.` };
    }
    if (partner.id === me.id) {
        return { error: "본인과의 궁합은 측정할 수 없어요." };
    }

    const mbtiResult = me.mbti && partner.mbti ? mbtiCompatibility(me.mbti, partner.mbti) : null;
    const sajuResult =
        me.saju && partner.saju
            ? sajuCompatibility(me.saju as unknown as SajuResult, partner.saju as unknown as SajuResult)
            : null;

    if (!mbtiResult && !sajuResult) {
        return {
            error: `${
                partner.nickName || partner.userName
            }님과의 궁합을 보려면 두 분 모두 MBTI나 민턴사주 측정이 필요해요.`,
        };
    }

    const overallScore =
        mbtiResult && sajuResult
            ? Math.round((mbtiResult.score + sajuResult.score) / 2)
            : (mbtiResult?.score ?? sajuResult?.score)!;

    return {
        success: true as const,
        partnerName: partner.nickName || partner.userName,
        overallScore,
        mbti: mbtiResult ? { myType: me.mbti!, partnerType: partner.mbti!, ...mbtiResult } : null,
        saju: sajuResult
            ? {
                  myElement: (me.saju as unknown as SajuResult).baseElement,
                  partnerElement: (partner.saju as unknown as SajuResult).baseElement,
                  ...sajuResult,
              }
            : null,
    };
}
