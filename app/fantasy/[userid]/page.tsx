import db from "@/lib/db";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";
import { joinLeague, logout } from "../actions";

async function getFantasyLeagues() {
    const leagues = await db.fantasyLeague.findMany({
        select: {
            id: true,
            leagueName: true,
            year: true,
            process: true,
            participants: {
                select: {
                    id: true,
                    nickName: true,
                },
            },
        },
        orderBy: {
            year: "desc",
        },
    });
    return leagues;
}

export default async function FantasyLeaguesPage() {
    const leagues = await getFantasyLeagues();
    const user = await getUser();

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold flex-grow">판타지 리그 목록</h1>
                <div className="flex items-center gap-2">
                    <Link
                        href="/fantasy/createleague"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        리그 만들기
                    </Link>
                    <form action={logout}>
                        <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            로그아웃
                        </button>
                    </form>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leagues.map((league) => {
                    const isParticipant = user ? league.participants.some((p) => p.id === user.id) : false;
                    return (
                        <div key={league.id} className="flex flex-col justify-between p-4 border rounded-lg shadow">
                            <Link href={`/fantasy/${league.id}`} className="block hover:bg-gray-50 -m-4 p-4">
                                <h2 className="text-xl font-semibold">{league.leagueName}</h2>
                                <p className="text-gray-600">{league.year}년</p>
                                <p className="text-gray-500">상태: {league.process}</p>
                                <div className="text-gray-500 mt-2">
                                    <span className="font-medium">참가자:</span>{" "}
                                    {league.participants.map((p) => p.nickName).join(", ")}
                                </div>
                            </Link>
                            {user && !isParticipant && (
                                <form action={joinLeague} className="mt-4">
                                    <input type="hidden" name="leagueId" value={league.id} />
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    >
                                        참가하기
                                    </button>
                                </form>
                            )}
                            {user && isParticipant && league.process === "드래프트중" && (
                                <div className="mt-4">
                                    <Link
                                        href={`/fantasy/draft/${league.id}`}
                                        className="block w-full text-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                                    >
                                        드래프트 참가
                                    </Link>
                                </div>
                            )}
                            {user && isParticipant && league.process === "드래프트 순서정하기" && (
                                <div className="mt-4">
                                    <Link
                                        href={`/fantasy/draft/${league.id}/order`}
                                        className="block w-full text-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                                    >
                                        드래프트 순서 정하기
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
