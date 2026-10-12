export type MbtiDimension = "EI" | "SN" | "TF" | "JP";

export interface MbtiQuestion {
    id: string;
    dimension: MbtiDimension;
    letterA: string;
    letterB: string;
    category: string;
    textA: string;
    textB: string;
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
    // E / I
    {
        id: "EI1",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "파트너",
        textA: "처음 만난 사람과도 복식 파트너를 하는 게 재미있다.",
        textB: "익숙한 파트너와 호흡을 맞추는 게 편하다.",
    },
    {
        id: "EI2",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "운동 후 뒤풀이",
        textA: "운동이 끝나면 사람들과 뒤풀이까지 하는 게 진짜 마무리다.",
        textB: "운동이 끝나면 바로 귀가해서 쉬는 게 좋다.",
    },
    {
        id: "EI3",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "코트에서의 대화",
        textA: "게임 중에도 파트너와 말을 주고받으며 치는 게 좋다.",
        textB: "게임 중에는 말없이 집중해서 치는 게 좋다.",
    },
    {
        id: "EI4",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "에너지 충전",
        textA: "여러 사람과 어울려 운동하면 에너지가 오른다.",
        textB: "사람이 많은 날은 운동 후 피곤해서 혼자 쉬고 싶다.",
    },
    {
        id: "EI5",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "모임 규모",
        textA: "20명 이상 모이는 큰 모임이나 대회 분위기가 좋다.",
        textB: "4~6명 정도의 소규모 모임이 좋다.",
    },
    {
        id: "EI6",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "연습 방식",
        textA: "랠리나 게임을 하면서 사람들과 부딪히며 실력을 키운다.",
        textB: "혼자 영상을 보거나 레슨, 개인 연습으로 조용히 실력을 키운다.",
    },
    {
        id: "EI7",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "대기 시간",
        textA: "순서를 기다리는 동안 옆 사람과 수다를 떠는 게 즐겁다.",
        textB: "순서를 기다리는 동안 혼자 스트레칭하거나 폰을 보며 쉰다.",
    },
    {
        id: "EI8",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "새 모임 가입",
        textA: "새 클럽에 가면 먼저 인사하고 말을 거는 편이다.",
        textB: "새 클럽에 가면 누가 말을 걸어줄 때까지 지켜보는 편이다.",
    },
    {
        id: "EI9",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "경기 후 분위기",
        textA: "게임이 끝나면 점수와 플레이를 크게 이야기하며 웃고 떠든다.",
        textB: "게임이 끝나면 혼자 조용히 복기하며 정리하는 편이다.",
    },
    {
        id: "EI10",
        dimension: "EI",
        letterA: "E",
        letterB: "I",
        category: "운동 계획",
        textA: "약속이 없어도 코트에 가면 누구든 있을 테니 일단 간다.",
        textB: "같이 칠 사람이 미리 정해져 있어야 마음 편히 간다.",
    },

    // S / N
    {
        id: "SN1",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "연습 방식",
        textA: "검증된 기본기와 정석 자세를 반복해서 익히는 게 좋다.",
        textB: "나만의 새로운 타법이나 변칙 플레이를 시도해 보는 게 좋다.",
    },
    {
        id: "SN2",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "실력 향상",
        textA: "지금 내 폼의 문제점을 구체적으로 짚어주는 코칭이 도움이 된다.",
        textB: "배드민턴 전체 흐름이나 전략을 이해시켜 주는 설명이 도움이 된다.",
    },
    {
        id: "SN3",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "상대 분석",
        textA: "상대가 실제로 보여준 샷과 습관을 보고 대응한다.",
        textB: "상대의 표정이나 분위기를 보고 '다음엔 이럴 것 같다'는 느낌으로 대응한다.",
    },
    {
        id: "SN4",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "게임 운영",
        textA: "확실한 점수를 낼 수 있는 안정적인 샷 위주로 운영한다.",
        textB: "허를 찌르는 페이크나 의외의 샷으로 승부를 걸어 본다.",
    },
    {
        id: "SN5",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "장비 선택",
        textA: "무게, 밸런스, 스펙 같은 구체적인 수치를 보고 라켓을 고른다.",
        textB: "손에 쥐었을 때의 느낌이나 라켓이 주는 이미지로 고른다.",
    },
    {
        id: "SN6",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "새로운 기술",
        textA: "이미 익숙한 기술을 더 완성도 있게 다듬는 게 좋다.",
        textB: "아직 못 해본 새로운 기술에 도전하는 게 더 재미있다.",
    },
    {
        id: "SN7",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "경기 복기",
        textA: "어떤 샷에서 몇 점을 잃었는지 구체적인 장면을 떠올린다.",
        textB: "전체적인 경기 흐름이 어디서 바뀌었는지 큰 그림으로 떠올린다.",
    },
    {
        id: "SN8",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "규칙과 방식",
        textA: "정해진 룰과 순서대로 진행되는 게임이 편하다.",
        textB: "방식을 바꿔 보거나 특별 규칙을 넣은 이벤트 게임이 재미있다.",
    },
    {
        id: "SN9",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "영상 시청",
        textA: "선수들의 구체적인 동작과 스텝을 따라 하려고 본다.",
        textB: "선수들의 전략과 경기 운영 스타일에서 아이디어를 얻으려고 본다.",
    },
    {
        id: "SN10",
        dimension: "SN",
        letterA: "S",
        letterB: "N",
        category: "경기 중 집중",
        textA: "지금 눈앞의 셔틀콕과 한 점 한 점에 집중한다.",
        textB: "다음 몇 수를 미리 내다보며 경기를 설계한다.",
    },

    // T / F
    {
        id: "TF1",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "게임 후 피드백",
        textA: "파트너의 실수는 솔직하게 짚어줘야 실력이 는다.",
        textB: "파트너가 기분 상하지 않게 돌려서 말해 주는 게 중요하다.",
    },
    {
        id: "TF2",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "승부와 분위기",
        textA: "이기는 것이 가장 중요하고, 이겨야 재미있다.",
        textB: "이기든 지든 다 같이 즐거운 분위기가 더 중요하다.",
    },
    {
        id: "TF3",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "파트너 선택",
        textA: "실력이 좋은 사람과 해야 게임이 잘 풀린다.",
        textB: "마음이 잘 맞고 편한 사람과 해야 게임이 잘 풀린다.",
    },
    {
        id: "TF4",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "실수했을 때",
        textA: "왜 실수했는지 원인을 분석하고 고치려고 한다.",
        textB: "파트너에게 미안한 마음이 앞서고 신경이 쓰인다.",
    },
    {
        id: "TF5",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "게임 배정",
        textA: "실력 차이가 크면 급을 나눠서 편성하는 게 합리적이다.",
        textB: "급이 달라도 서로 어울려 치는 게 모임답다.",
    },
    {
        id: "TF6",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "심판과 점수 판정",
        textA: "애매한 인아웃은 규칙대로 정확히 판정해야 한다.",
        textB: "애매한 건 서로 양보하고 넘어가는 게 좋다.",
    },
    {
        id: "TF7",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "초보자 대하기",
        textA: "초보자에게는 정확한 기술 교정을 해주는 게 도움이 된다.",
        textB: "초보자에게는 격려와 칭찬을 해주는 게 먼저다.",
    },
    {
        id: "TF8",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "승부처에서",
        textA: "점수가 밀리면 냉정하게 전략을 바꾼다.",
        textB: "점수가 밀리면 파트너와 서로 기운을 북돋아 준다.",
    },
    {
        id: "TF9",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "모임 운영 의견",
        textA: "모임 규칙이나 회비는 원칙대로 엄격하게 지켜야 한다.",
        textB: "사정이 있는 회원은 상황에 맞게 융통성 있게 봐줘야 한다.",
    },
    {
        id: "TF10",
        dimension: "TF",
        letterA: "T",
        letterB: "F",
        category: "칭찬을 들을 때",
        textA: "샷의 정확도나 전술에 대한 인정이 더 기분 좋다.",
        textB: "같이 쳐서 즐거웠다는 말이 더 기분 좋다.",
    },

    // J / P
    {
        id: "JP1",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "운동 일정",
        textA: "요일과 시간을 정해 두고 정기적으로 운동한다.",
        textB: "그날 컨디션과 기분에 따라 즉흥적으로 간다.",
    },
    {
        id: "JP2",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "코트 도착",
        textA: "시간 전에 도착해서 몸을 충분히 풀고 시작한다.",
        textB: "시간에 맞춰 가거나 조금 빠듯하게 도착해도 괜찮다.",
    },
    {
        id: "JP3",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "장비 준비",
        textA: "라켓, 셔틀콕, 갈아입을 옷을 전날 미리 챙겨 둔다.",
        textB: "나가기 직전에 대충 챙겨 간다.",
    },
    {
        id: "JP4",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "게임 순서",
        textA: "대진표나 순서가 미리 정해져 있는 게 편하다.",
        textB: "그때그때 분위기에 따라 즉석에서 팀을 짜는 게 재미있다.",
    },
    {
        id: "JP5",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "연습 계획",
        textA: "이번 달엔 어떤 기술을 연습할지 목표와 계획을 세운다.",
        textB: "계획 없이 치다가 하고 싶은 것을 그때 연습한다.",
    },
    {
        id: "JP6",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "대회 참가",
        textA: "대회 일정이 잡히면 미리 준비하고 연습 계획을 짠다.",
        textB: "대회는 임박해서 컨디션을 보고 결정하는 편이다.",
    },
    {
        id: "JP7",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "모임 약속",
        textA: "약속한 시간과 장소가 바뀌면 불편하다.",
        textB: "장소나 시간이 바뀌어도 크게 신경 쓰지 않는다.",
    },
    {
        id: "JP8",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "장비 구매",
        textA: "필요한 걸 정리하고 비교한 뒤에 신중하게 산다.",
        textB: "눈에 들어오면 그 자리에서 사고, 마음이 바뀌면 또 산다.",
    },
    {
        id: "JP9",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "경기 진행",
        textA: "한 게임이 끝나면 다음 게임까지 깔끔하게 정리하고 이어가는 게 좋다.",
        textB: "흐름 가는 대로 자연스럽게 이어가는 게 좋다.",
    },
    {
        id: "JP10",
        dimension: "JP",
        letterA: "J",
        letterB: "P",
        category: "운동 후 마무리",
        textA: "운동 기록이나 다음 일정을 바로 정리해 둔다.",
        textB: "기록은 딱히 안 하고, 다음 일정은 나중에 생각한다.",
    },
];

/**
 * 1(A에 가깝다)~5(B에 가깝다) 응답을 바탕으로 MBTI 유형을 계산합니다.
 * 각 문항 점수는 (응답값 - 3)으로 환산되어 -2(완전 A)~+2(완전 B)로 더해지며,
 * 차원별 합이 0 이하이면 A, 양수이면 B 성향으로 판정합니다(동점은 A 우선).
 */
export function calculateMbti(answers: Record<string, number>): {
    type: string;
    totals: Record<MbtiDimension, number>;
} {
    const totals: Record<MbtiDimension, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

    MBTI_QUESTIONS.forEach((q) => {
        const value = answers[q.id];
        if (value === undefined) return;
        totals[q.dimension] += value - 3;
    });

    const type =
        (totals.EI <= 0 ? "E" : "I") +
        (totals.SN <= 0 ? "S" : "N") +
        (totals.TF <= 0 ? "T" : "F") +
        (totals.JP <= 0 ? "J" : "P");

    return { type, totals };
}

export const MBTI_DESCRIPTIONS: Record<string, string> = {
    ISTJ: "정해진 시간, 정해진 코트. 기본기를 묵묵히 다지는 신뢰의 수비수.",
    ISFJ: "초보자를 세심하게 챙기고 모임의 분위기를 조용히 지키는 든든한 살림꾼.",
    INFJ: "경기 흐름을 큰 그림으로 읽고, 파트너의 마음까지 헤아리는 조용한 전략가.",
    INTJ: "데이터와 전략으로 코트를 설계하는 침착한 두뇌파.",
    ISTP: "말보다 라켓으로 보여주는 실전형. 혼자 연습하며 묵묵히 실력을 쌓는다.",
    ISFP: "느낌 가는 대로, 분위기 좋은 코트가 최고. 부담 없이 즐기는 자유로운 플레이어.",
    INFP: "같이 친 사람과의 즐거운 기억이 스코어보다 소중한 감성파.",
    INTP: "새로운 타법과 변칙 플레이를 혼자 탐구하는 실험적인 스타일리스트.",
    ESTJ: "대진표도 규칙도 칼같이! 모임을 체계적으로 이끄는 타고난 운영자.",
    ESFJ: "뒤풀이까지가 진짜 운동. 모두를 챙기는 분위기 메이커.",
    ENFJ: "팀 전체의 텐션을 끌어올리는 열정 넘치는 응원단장.",
    ENTJ: "승부욕 넘치는 코트의 리더. 이기기 위한 전략을 망설임 없이 실행한다.",
    ESTP: "순서 기다리는 시간도 아까운 실전 체질. 지금 이 순간의 랠리에 집중한다.",
    ESFP: "코트의 분위기 메이커. 사람 많은 날이 제일 신나는 흥 넘치는 플레이어.",
    ENFP: "누구와도 금세 친해지는 복식 파트너계의 인싸, 즉흥 플레이도 즐긴다.",
    ENTP: "허를 찌르는 샷과 즉석 아이디어로 코트를 즐겁게 뒤흔드는 승부사.",
};
