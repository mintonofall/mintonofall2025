export interface Player {
    id: number;
    name: string;
    age: number | null;
    grade: string;
    clubid: number;
    gender: string;
    games: number;
    win: number;
    lose: number;

    avater: string | null;
    suttlePoint: number;
    mmr: number;
    gameDatas: Date[];
    winDatas: string[];
    loseDatas: string[];
    enterDatas: Date[];
}

export interface WaitGameListCLass {
    point: number;
    clubid: number;
    playerid: number;
}
