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
    lastGameDate: Date | null;
}

export interface MatchDiary {
    id: number;
    clubid: number;
    userid: number;
    players: number[];
    winner1id: number | null;
    winner2id: number | null;
    score1: number | null;
    score2: number | null;
    startTime: Date | null;
    endTime: Date | null;
}
