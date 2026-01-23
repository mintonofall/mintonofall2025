import db from "@/lib/db";
import Link from "next/link";
import GradeSelector from "./GradeSelector";

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
    const dogPlayers = await db.dogPlayer.findMany({ orderBy, where });

    // 필터 유지를 위한 쿼리 스트링 생성
    let filterQuery = "";
    if (grade) filterQuery += `&grade=${grade}`;
    if (gender) filterQuery += `&gender=${gender}`;

    return (
        <div className="flex flex-col h-screen w-full">
            {/* 상단 1/2: 게임 테이블 영역 */}
            <div className="h-1/2 w-full bg-gray-100 p-4 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-700">Game Table</h1>
            </div>
            {/* 하단 1/2: DogPlayers 목록 영역 */}
            <div className="h-1/2 w-full bg-white p-4 border-t-2 border-gray-300 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2 text-sm items-center">
                        <GradeSelector />
                        <Link
                            href={`?sort=name${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${!sort || sort === "name" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            이름
                        </Link>
                        <Link
                            href={`?sort=grade${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${sort === "grade" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            급수
                        </Link>
                        <Link
                            href={`?sort=gameNum_desc${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${sort === "gameNum_desc" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            게임많은
                        </Link>
                        <Link
                            href={`?sort=gameNum_asc${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${sort === "gameNum_asc" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            게임적은
                        </Link>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">
                                    이름
                                </th>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                    지역
                                </th>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                    급수
                                </th>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                    게임수
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dogPlayers.map((player) => (
                                <tr
                                    key={player.id}
                                    className={`${
                                        player.gender === "man"
                                            ? "bg-blue-100"
                                            : player.gender === "woman"
                                              ? "bg-red-100"
                                              : "bg-white"
                                    } hover:opacity-80 transition-colors`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-800">
                                        {player.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600 font-medium">
                                        {player.where}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800 font-semibold">
                                        {player.grade}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-blue-600 font-bold">
                                        {player.gameNum}G
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
