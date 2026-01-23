import { getResult } from "@/lib/getResult";
import Image from "next/image";
import db from "@/lib/db";

export default async function Result({ params }: { params: Promise<{ leagueId: string }> }) {
    const { leagueId } = await params;
    const league = await db.fantasyLeague.findUnique({
        where: { id: Number(leagueId) },
        select: { year: true },
    });

    const targetDate = league?.year === 2025 ? "2025-12-19" : "2024-12-13";
    const titleDate = league?.year === 2025 ? "2025년 12월 19일" : "2024년 12월 13일";

    const games = await getResult(targetDate);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">{titleDate} 경기 결과</h1>
            <div className="space-y-4">
                {games.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">해당 날짜의 경기 결과가 없습니다.</div>
                ) : (
                    games.map((game) => (
                        <div key={game.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2 text-sm text-gray-500"></div>
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex-1 flex items-center justify-end gap-2 
                                    `}
                                >
                                    <span>{game.player1.name}</span>
                                    {game.player1.photo && (
                                        <Image
                                            src={game.player1.photo}
                                            alt={game.player1.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="mx-4 text-sm font-mono bg-gray-100 px-2 py-1 rounded flex flex-col items-center justify-center min-w-[60px]">
                                    {(() => {
                                        const scores = game.gameResult;
                                        let pd: number[] = [];
                                        if (scores.length == 6) {
                                            pd = [
                                                scores[0] + scores[2] + scores[4] - scores[1] - scores[3] - scores[5],
                                                scores[1] + scores[3] + scores[5] - scores[0] - scores[2] - scores[4],
                                            ];
                                        }
                                        if (scores.length == 4) {
                                            pd = [
                                                scores[0] + scores[2] - scores[1] - scores[3],
                                                scores[1] + scores[3] - scores[0] - scores[2],
                                            ];
                                        }

                                        return (
                                            <>
                                                {scores[0] && scores[1] && (
                                                    <div>
                                                        {scores[0]}-{scores[1]}
                                                    </div>
                                                )}
                                                {scores[2] && scores[3] && (
                                                    <div>
                                                        {scores[2]}-{scores[3]}
                                                    </div>
                                                )}
                                                {scores[4] && scores[5] && (
                                                    <div>
                                                        {scores[4]}-{scores[5]}
                                                    </div>
                                                )}
                                                {pd.length > 0 && (
                                                    <div>
                                                        <span
                                                            className={
                                                                pd[0] > 0
                                                                    ? "text-green-600"
                                                                    : pd[0] < 0
                                                                    ? "text-red-600"
                                                                    : ""
                                                            }
                                                        >
                                                            ({pd[0]})
                                                        </span>
                                                        -
                                                        <span
                                                            className={
                                                                pd[1] > 0
                                                                    ? "text-green-600"
                                                                    : pd[1] < 0
                                                                    ? "text-red-600"
                                                                    : ""
                                                            }
                                                        >
                                                            ({pd[1]})
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                                <div
                                    className={`flex-1 flex items-center justify-start gap-2 
                                    `}
                                >
                                    {game.player2.photo && (
                                        <Image
                                            src={game.player2.photo}
                                            alt={game.player2.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    )}
                                    <span>{game.player2.name}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
