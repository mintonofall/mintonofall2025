"use server";

import db from "@/lib/db";
import { pushWaitPlayerList } from "@/lib/getUserGoHome";

export async function inputWaitPlayer(many: number) {
    console.log(many);
    //클럽의 플레이어 목록을 가져온다.
    const players = await db.player.findMany({
        where: {
            clubid: 6,
        },
    });
    //반환된 플레이어의 목록에서 id만 추출한다

    const playerIds = players.map((player) => player.id);
    let limitedPlayerIds: number[] = [];
    if (playerIds.length < many) {
        limitedPlayerIds = playerIds.slice(0, playerIds.length);
    } else {
        limitedPlayerIds = playerIds.slice(0, many);
    }
    console.log(limitedPlayerIds);

    //반환된 id 를 이용하여 pushWaitPlayerLiat를 이용해 대기열에 넣는다.
    const result = playerIds.forEach(async (playerIds, idx) => {
        if (idx < 30) {
            await pushWaitPlayerList(playerIds, 6);
        }
    });

    //대기열에 넣은 플레이어의 id를 이용하여 대기열에 넣은 플레이어의 정보를 가져온다.
    console.log(result);

    return;
}
