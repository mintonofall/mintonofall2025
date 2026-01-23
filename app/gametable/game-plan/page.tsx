import db from "@/lib/db";
import GamePlanClient from "./GamePlanClient";

export default async function GameTable({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string; grade?: string; gender?: string }>;
}) {
    const { sort, grade, gender } = await searchParams;

    // 한국 시간(KST) 기준 오늘 날짜 범위 계산
    const now = new Date();
    const utc = now.getTime();
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const kstTimestamp = utc + KST_OFFSET;
    const kstDate = new Date(kstTimestamp);

    kstDate.setUTCHours(0, 0, 0, 0);
    const startOfToday = new Date(kstDate.getTime() - KST_OFFSET);

    kstDate.setUTCHours(23, 59, 59, 999);
    const endOfToday = new Date(kstDate.getTime() - KST_OFFSET);

    // 오늘 진행된 게임 가져오기
    const todayGames = await db.dogGames.findMany({
        where: {
            createdAt: {
                gte: startOfToday,
                lte: endOfToday,
            },
        },
        select: {
            Players: true,
        },
    });

    // 플레이어별 오늘 게임 수 계산
    const todayGameCounts: Record<number, number> = {};
    todayGames.forEach((game) => {
        game.Players.forEach((playerId) => {
            todayGameCounts[playerId] = (todayGameCounts[playerId] || 0) + 1;
        });
    });

    let orderBy = {};
    if (sort === "grade") {
        orderBy = { grade: "asc" };
    } else {
        // gameNum 정렬이거나 기본 정렬일 때 이름순으로 먼저 가져옴 (JS 정렬 시 stable sort 활용)
        orderBy = { name: "asc" };
    }

    const where: { grade?: string; gender?: string } = {};
    if (grade && grade !== "all") where.grade = grade;
    if (gender && gender !== "all") where.gender = gender;

    // DogPlayers 목록 가져오기
    const dogPlayers = (await db.dogPlayer.findMany({ orderBy, where })).map((player) => ({
        id: player.id,
        name: player.name,
        where: player.where ?? "",
        grade: player.grade ?? "",
        gameNum: todayGameCounts[player.id] || 0, // 오늘 게임 수로 설정
        gender: player.gender ?? "",
    }));

    // 오늘 게임 수 기준으로 정렬 (JS에서 처리)
    if (sort === "gameNum_desc") {
        dogPlayers.sort((a, b) => b.gameNum - a.gameNum);
    } else if (sort === "gameNum_asc") {
        dogPlayers.sort((a, b) => a.gameNum - b.gameNum);
    }

    // 필터 유지를 위한 쿼리 스트링 생성
    let filterQuery = "";
    if (grade) filterQuery += `&grade=${grade}`;
    if (gender) filterQuery += `&gender=${gender}`;

    return <GamePlanClient dogPlayers={dogPlayers} filterQuery={filterQuery} sort={sort} />;
}
