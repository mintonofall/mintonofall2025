declare module "lunar-javascript" {
    export class EightChar {
        getYearGan(): string;
        getYearZhi(): string;
        getMonthGan(): string;
        getMonthZhi(): string;
        getDayGan(): string;
        getDayZhi(): string;
        getTimeGan(): string;
        getTimeZhi(): string;
    }

    export class Lunar {
        static fromYmd(year: number, month: number, day: number): Lunar;
        getSolar(): Solar;
        getEightChar(): EightChar;
    }

    export class Solar {
        static fromYmd(year: number, month: number, day: number): Solar;
        static fromYmdHms(
            year: number,
            month: number,
            day: number,
            hour: number,
            minute: number,
            second: number,
        ): Solar;
        getYear(): number;
        getMonth(): number;
        getDay(): number;
        getLunar(): Lunar;
        toString(): string;
    }
}
