export interface GameReviewMenu {
    title: string;
    description: string;
    url: string;
    isLogin: boolean;
}

export const Menus: GameReviewMenu[] = [
    {
        title: "나의베팅",
        description: "오늘 나의 베팅",
        url: "/[id]/myBetting",
        isLogin: true,
    },
    {
        title: "다전순위",
        description: "가장많은 게임을 한 순위",
        url: "/[id]/manyGame",
        isLogin: false,
    },
    {
        title: "다승순위",
        description: "많이 이긴 선수 순위",
        url: "/[id]/manyWin",
        isLogin: false,
    },
    {
        title: "인기 픽 순위",
        description: "유저들이 가장 많이 승리할 것이라 믿고 선택한 선수",
        url: "/[id]/manyPick",
        isLogin: false,
    },
    {
        title: "예측왕",
        description: "예측을 잘한 순위",
        url: "/[id]/bettingKing",
        isLogin: false,
    },
];
