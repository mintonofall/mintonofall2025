import { calculateSaju } from "./sajuCalc";
import type { SajuResult } from "./sajuTypes";

export const GUEST_PLAYER = {
    name: "장수영",
    photo: "/guestPlayers/jangsooyoung.jpg",
    mbti: "ENFJ",
    bio: "대한민국 前 여자 배드민턴 국가대표(2003~2012)로, 수디르만컵 동메달(2007)과 우버컵 동메달(2008)을 따낸 선수예요. 중학교 3학년 때 최연소로 국가대표에 발탁됐고, 은퇴 후에는 SPOTV 배드민턴 해설위원 겸 실업배드민턴연맹 부회장으로 활동하고 있어요.",
};

/** 장수영 선수의 생년월일(1988-09-22, 양력, 태어난 시간 모름)로 계산한 민턴사주입니다. */
export function getGuestSaju(): SajuResult {
    return calculateSaju({ calendarType: "solar", year: 1988, month: 9, day: 22 });
}
