"use server";

import db from "./db";

export async function makePlayer(fromClub: number, toClub: number) {
    const fromPlayer = await db.player.findMany({
        where: {
            clubid: fromClub,
        },
    });
    console.log(fromPlayer);
    // id와 개인 식별 정보(이게 나에요로 연결된 유저, MBTI, 생일, 사주)는 새 클럽으로 복제하지 않습니다.
    const newClubPlayer = fromPlayer.map(
        ({
            id: _id,
            linkedUserId: _linkedUserId,
            mbti: _mbti,
            birthYear: _birthYear,
            birthMonth: _birthMonth,
            birthDay: _birthDay,
            birthCalendarType: _birthCalendarType,
            birthIsLeapMonth: _birthIsLeapMonth,
            birthHour: _birthHour,
            saju: _saju,
            ...rest
        }) => ({
            ...rest,
            clubid: toClub,
        }),
    );

    console.log(newClubPlayer);
    const result = await db.player.createMany({
        data: newClubPlayer,
    });
    return result;
}
