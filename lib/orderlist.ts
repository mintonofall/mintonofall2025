import db from "./db";

/**
 * 판타지 리그의 orderList를 생성하고 업데이트합니다.
 * order 배열의 앞 4개 요소를 사용하여 [a,b,c,d,d,c,b,a] 패턴을 만들고,
 * 이 패턴을 3번 반복하여 orderList에 저장합니다.
 * @param leagueId 판타지 리그의 ID
 * @returns 업데이트된 판타지 리그 객체. 리그가 없거나 order가 비어있으면 null을 반환합니다.
 */
export async function createFantasyLeagueOrderList(leagueId: number) {
    const fantasyLeague = await db.fantasyLeague.findUnique({
        where: {
            id: leagueId,
        },
    });

    if (!fantasyLeague || fantasyLeague.order.length < 4) {
        console.log("리그를 찾을 수 없거나, order 배열에 최소 4개의 아이템이 필요합니다.");
        return null;
    }

    const order = fantasyLeague.order;
    const forward = order.slice(0, 4);
    const backward = [...forward].reverse();

    const pattern = [...forward, ...backward];

    const newOrderList = [...pattern, ...pattern, ...pattern];

    const updatedLeague = await db.fantasyLeague.update({
        where: { id: leagueId },
        data: { orderList: newOrderList },
    });

    return updatedLeague;
}
