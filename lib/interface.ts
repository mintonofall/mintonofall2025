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

export interface ClubDiary {
    id: number;
    clubName: string;
    userid: number;
}

export interface PlayerDiary {
    id: number;
    name: string;
    grade: string | null;
    gender: string | null;
    age: number | null;
    avater: string | null;
    clubid: number;
    mmr: number;
    isMe: boolean;
}
