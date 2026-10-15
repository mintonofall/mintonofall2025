export type StyleAxis = "comm" | "play";
export type StyleLetter = "A" | "B" | "C" | "D";

export interface StyleOption {
    letter: StyleLetter;
    text: string;
    tag: string;
}

export interface StyleQuestion {
    id: string;
    axis: StyleAxis;
    title: string;
    text: string;
    options: StyleOption[];
}

export const COMM_QUESTIONS: StyleQuestion[] = [
    {
        id: "comm1",
        axis: "comm",
        title: "콜 습관",
        text: "셔틀이 두 사람 사이로 떨어질 때 나는?",
        options: [
            { letter: "A", text: '내가 먼저 "내 거!" 하고 크게 콜한다', tag: "주도형" },
            { letter: "B", text: "파트너의 콜을 기다렸다가 맞춘다", tag: "맞춤형" },
            { letter: "C", text: "콜 없이 움직임과 눈치로 처리한다", tag: "직관형" },
            { letter: "D", text: "그때그때 다르다", tag: "유동형" },
        ],
    },
    {
        id: "comm2",
        axis: "comm",
        title: "실수 후 반응",
        text: "내 실수로 점수를 잃었을 때 나는?",
        options: [
            { letter: "A", text: '바로 "미안!" 하고 털어낸다', tag: "회복빠름" },
            { letter: "B", text: "말은 안 해도 속으로 계속 곱씹는다", tag: "내향소화" },
            { letter: "C", text: "웃음으로 분위기를 풀려고 한다", tag: "분위기메이커" },
            { letter: "D", text: "다음 플레이에 더 집중한다", tag: "몰입형" },
        ],
    },
    {
        id: "comm3",
        axis: "comm",
        title: "듀스 접전",
        text: "듀스 접전에서 나는?",
        options: [
            { letter: "A", text: "오히려 집중력이 올라간다", tag: "강심장" },
            { letter: "B", text: "긴장돼서 몸이 굳는다", tag: "긴장형" },
            { letter: "C", text: "파트너에게 말을 걸며 긴장을 푼다", tag: "소통형" },
            { letter: "D", text: "평소와 크게 다르지 않다", tag: "평정형" },
        ],
    },
    {
        id: "comm4",
        axis: "comm",
        title: "파트너 실수 대처",
        text: "파트너가 연속으로 실수할 때 나는?",
        options: [
            { letter: "A", text: '"괜찮아, 다음 거!" 하고 격려한다', tag: "격려형" },
            { letter: "B", text: "작전을 바꾸자고 제안한다", tag: "전략형" },
            { letter: "C", text: "말없이 내가 더 많이 커버한다", tag: "희생형" },
            { letter: "D", text: "솔직하게 어디가 문제인지 말한다", tag: "직설형" },
        ],
    },
    {
        id: "comm5",
        axis: "comm",
        title: "패배 직후",
        text: "게임에서 진 직후 나는?",
        options: [
            { letter: "A", text: "바로 원인을 같이 복기하고 싶다", tag: "분석형" },
            { letter: "B", text: "깔끔하게 털고 다음 게임으로 간다", tag: "쿨한형" },
            { letter: "C", text: "수다나 뒤풀이로 푼다", tag: "소통해소형" },
            { letter: "D", text: "혼자 조용히 생각을 정리한다", tag: "내향정리형" },
        ],
    },
];

export const PLAY_QUESTIONS: StyleQuestion[] = [
    {
        id: "play1",
        axis: "play",
        title: "선호 포지션",
        text: "내가 가장 편한 포지션은?",
        options: [
            { letter: "A", text: "전위에서 푸시와 네트 플레이", tag: "전위공격형" },
            { letter: "B", text: "후위에서 강한 스매시", tag: "후위공격형" },
            { letter: "C", text: "어디서든 파트너 위치에 맞춰 이동", tag: "유연형" },
            { letter: "D", text: "뒤에서 받아내며 수비를 안정시키는 자리", tag: "수비안정형" },
        ],
    },
    {
        id: "play2",
        axis: "play",
        title: "랠리 운영",
        text: "랠리가 길어질 때 나는?",
        options: [
            { letter: "A", text: "빨리 끝내려고 공격 타이밍을 찾는다", tag: "결정형" },
            { letter: "B", text: "끈질기게 받아내며 상대 실수를 기다린다", tag: "끈기형" },
            { letter: "C", text: "코스를 바꿔가며 흔들어본다", tag: "변화형" },
            { letter: "D", text: "상대 약점이 보일 때까지 탐색한다", tag: "탐색형" },
        ],
    },
    {
        id: "play3",
        axis: "play",
        title: "체력 배분",
        text: "한 게임 동안 체력 배분은?",
        options: [
            { letter: "A", text: "초반에 전력으로 몰아붙인다", tag: "초반폭발형" },
            { letter: "B", text: "후반에 체력을 남겨두고 승부를 건다", tag: "후반승부형" },
            { letter: "C", text: "처음부터 끝까지 일정한 페이스", tag: "일정형" },
            { letter: "D", text: "점수 상황에 따라 강약 조절", tag: "조절형" },
        ],
    },
    {
        id: "play4",
        axis: "play",
        title: "경기 템포",
        text: "선호하는 경기 템포는?",
        options: [
            { letter: "A", text: "빠르고 몰아치는 속공", tag: "고속템포" },
            { letter: "B", text: "천천히 코스를 만들어가는 운영", tag: "저속템포" },
            { letter: "C", text: "상대 템포에 맞춰 바꾼다", tag: "적응형" },
            { letter: "D", text: "빠름과 느림을 섞어 리듬을 깬다", tag: "변속형" },
        ],
    },
    {
        id: "play5",
        axis: "play",
        title: "위기 샷 선택",
        text: "위기 상황(매치포인트 등)에서 선택하는 샷은?",
        options: [
            { letter: "A", text: "강한 스매시로 정면 승부", tag: "공격선택" },
            { letter: "B", text: "안전한 클리어나 드라이브", tag: "안전선택" },
            { letter: "C", text: "드롭이나 헤어핀으로 허를 찌른다", tag: "변칙선택" },
            { letter: "D", text: "파트너 위치를 보고 가장 비는 곳으로", tag: "상황판단" },
        ],
    },
];

export const STYLE_QUESTIONS: StyleQuestion[] = [...COMM_QUESTIONS, ...PLAY_QUESTIONS];
