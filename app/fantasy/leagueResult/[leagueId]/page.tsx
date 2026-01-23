import db from "@/lib/db";
import { notFound } from "next/navigation";

type PageParams = Promise<{ leagueId: string }>;

async function getLeagueResults(leagueId: number) {
    const teams = await db.fantasyTeam.findMany({
        where: { fantasyLeagueId: leagueId },
        select: {
            id: true,
            user: {
                select: {
                    nickName: true,
                },
            },
            firstRoundResult: true,
            secondRoundResult: true,
            thirdRoundResult: true,
        },
    });

    const teamsWithStats = teams.map((team) => {
        let win = 0;
        let draw = 0;
        let lose = 0;

        [team.firstRoundResult, team.secondRoundResult, team.thirdRoundResult].forEach((result) => {
            if (result === "win") win++;
            else if (result === "draw") draw++;
            else if (result === "lose") lose++;
        });

        return {
            ...team,
            win,
            draw,
            lose,
        };
    });

    // 승리 순으로 정렬 (승 -> 무 -> 패)
    teamsWithStats.sort((a, b) => {
        if (b.win !== a.win) return b.win - a.win;
        if (b.draw !== a.draw) return b.draw - a.draw;
        return a.lose - b.lose;
    });

    return teamsWithStats;
}

export default async function LeagueResult({ params }: { params: PageParams }) {
    const leagueId = Number((await params).leagueId);

    if (isNaN(leagueId)) {
        return notFound();
    }

    const results = await getLeagueResults(leagueId);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">최종 순위</h1>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="py-4 px-6 text-center font-bold text-gray-600">순위</th>
                            <th className="py-4 px-6 text-left font-bold text-gray-600">팀 이름</th>
                            <th className="py-4 px-6 text-center font-bold text-gray-600">승</th>
                            <th className="py-4 px-6 text-center font-bold text-gray-600">무</th>
                            <th className="py-4 px-6 text-center font-bold text-gray-600">패</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((team, index) => {
                            let rankColor = "bg-white";
                            if (index === 0) rankColor = "bg-yellow-50"; // 1등 강조

                            return (
                                <tr key={team.id} className={`border-b last:border-0 hover:bg-gray-50 ${rankColor}`}>
                                    <td className="py-4 px-6 text-center font-bold text-xl text-gray-700">
                                        {index + 1}위
                                    </td>
                                    <td className="py-4 px-6 text-left font-medium text-lg">
                                        {team.user.nickName}의 팀
                                    </td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-bold text-lg">
                                        {team.win}
                                    </td>
                                    <td className="py-4 px-6 text-center text-gray-600 font-bold text-lg">
                                        {team.draw}
                                    </td>
                                    <td className="py-4 px-6 text-center text-red-600 font-bold text-lg">
                                        {team.lose}
                                    </td>
                                </tr>
                            );
                        })}
                        {results.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    아직 경기 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
