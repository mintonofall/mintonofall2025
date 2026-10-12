import { Lunar, Solar } from "lunar-javascript";
import { ELEMENT_STYLE, type Element, type Pillar, type SajuInput, type SajuResult } from "./sajuTypes";

const GAN_MAP: Record<string, { hangul: string; element: Element }> = {
    甲: { hangul: "갑", element: "목" },
    乙: { hangul: "을", element: "목" },
    丙: { hangul: "병", element: "화" },
    丁: { hangul: "정", element: "화" },
    戊: { hangul: "무", element: "토" },
    己: { hangul: "기", element: "토" },
    庚: { hangul: "경", element: "금" },
    辛: { hangul: "신", element: "금" },
    壬: { hangul: "임", element: "수" },
    癸: { hangul: "계", element: "수" },
};

const ZHI_MAP: Record<string, { hangul: string; element: Element }> = {
    子: { hangul: "자", element: "수" },
    丑: { hangul: "축", element: "토" },
    寅: { hangul: "인", element: "목" },
    卯: { hangul: "묘", element: "목" },
    辰: { hangul: "진", element: "토" },
    巳: { hangul: "사", element: "화" },
    午: { hangul: "오", element: "화" },
    未: { hangul: "미", element: "토" },
    申: { hangul: "신", element: "금" },
    酉: { hangul: "유", element: "금" },
    戌: { hangul: "술", element: "토" },
    亥: { hangul: "해", element: "수" },
};

function toPillar(gan: string, zhi: string): Pillar {
    const g = GAN_MAP[gan];
    const z = ZHI_MAP[zhi];
    return {
        ganHanja: gan,
        ganHangul: g.hangul,
        zhiHanja: zhi,
        zhiHangul: z.hangul,
        ganElement: g.element,
        zhiElement: z.element,
    };
}

/**
 * 생년월일(+시간)로 사주팔자를 계산하고, 오행 분포를 바탕으로 배드민턴 플레이 성향을 분석합니다.
 */
export function calculateSaju(input: SajuInput): SajuResult {
    const { calendarType, year, month, day, isLeapMonth, hour } = input;

    // 입력된 날짜를 먼저 양력(y, m, d)으로 환산합니다.
    const baseSolar =
        calendarType === "lunar" ? Lunar.fromYmd(year, isLeapMonth ? -month : month, day).getSolar() : null;
    const solarYear = baseSolar ? baseSolar.getYear() : year;
    const solarMonth = baseSolar ? baseSolar.getMonth() : month;
    const solarDay = baseSolar ? baseSolar.getDay() : day;

    // 시간은 연/월/일주에는 영향을 주지 않으므로, 모를 경우 0시로 계산하고 시주만 생략합니다.
    const ec = Solar.fromYmdHms(solarYear, solarMonth, solarDay, hour ?? 0, 0, 0).getLunar().getEightChar();

    const yearPillar = toPillar(ec.getYearGan(), ec.getYearZhi());
    const monthPillar = toPillar(ec.getMonthGan(), ec.getMonthZhi());
    const dayPillar = toPillar(ec.getDayGan(), ec.getDayZhi());
    const timePillar = hour != null ? toPillar(ec.getTimeGan(), ec.getTimeZhi()) : null;

    const elementCounts: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    const allPillars = [yearPillar, monthPillar, dayPillar, ...(timePillar ? [timePillar] : [])];
    allPillars.forEach((p) => {
        elementCounts[p.ganElement] += 1;
        elementCounts[p.zhiElement] += 1;
    });

    const sortedElements = (Object.entries(elementCounts) as [Element, number][]).sort((a, b) => b[1] - a[1]);
    const dominantElement = sortedElements[0][0];
    const weakestElement = sortedElements[sortedElements.length - 1][0];
    const baseElement = dayPillar.ganElement;

    const dominantInfo = ELEMENT_STYLE[dominantElement];
    const weakestInfo = ELEMENT_STYLE[weakestElement];
    const baseInfo = ELEMENT_STYLE[baseElement];

    const analysis =
        dominantElement === weakestElement
            ? `일간(나 자신)은 ${baseInfo.name} 기운으로, 기본적으로 ${baseInfo.description}를 보입니다. 오행이 고르게 분포되어 있어 특정 스타일에 치우치지 않는 균형 잡힌 플레이어입니다.`
            : `일간(나 자신)은 ${baseInfo.name} 기운으로, 기본적으로 ${baseInfo.description}를 보입니다. 사주 전체에서는 ${dominantInfo.name} 기운이 가장 강해 ${dominantInfo.style} 성향(${dominantInfo.description})이 두드러지는 반면, ${weakestInfo.name} 기운이 부족해 ${weakestInfo.style} 쪽은 약한 편입니다. ${weakestInfo.trainingTip}을 보완해보세요.`;

    return {
        pillars: { year: yearPillar, month: monthPillar, day: dayPillar, time: timePillar },
        elementCounts,
        dominantElement,
        weakestElement,
        baseElement,
        analysis,
        calculatedAt: new Date().toISOString(),
    };
}
