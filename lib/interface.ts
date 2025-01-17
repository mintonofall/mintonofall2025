export interface Player {
    id: number;
    name: string;
    age: number;
    grade: string;
    clubid: number;
    gender: string;
    games: number;
    win: number;
    avater: string | null;
    suttlePoint: number;
    mmr: number;
    gameDatas: Date[];
    winDatas: string[];
    loseDatas: string[];
}
