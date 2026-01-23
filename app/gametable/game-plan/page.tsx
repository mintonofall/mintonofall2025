import db from "@/lib/db";
import GamePlanClient from "./GamePlanClient";

export default async function GameTable({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string; grade?: string; gender?: string }>;
}) {
    const { sort, grade, gender } = await searchParams;
    let orderBy = {};
    if (sort === "gameNum_desc") {
        orderBy = { gameNum: "desc" };
    } else if (sort === "gameNum_asc") {
        orderBy = { gameNum: "asc" };
    } else if (sort === "grade") {
        orderBy = { grade: "asc" };
    } else {
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
        gameNum: player.gameNum,
        gender: player.gender ?? "",
    }));

    // 필터 유지를 위한 쿼리 스트링 생성
    let filterQuery = "";
    if (grade) filterQuery += `&grade=${grade}`;
    if (gender) filterQuery += `&gender=${gender}`;

    return <GamePlanClient dogPlayers={dogPlayers} filterQuery={filterQuery} sort={sort} />;
}
