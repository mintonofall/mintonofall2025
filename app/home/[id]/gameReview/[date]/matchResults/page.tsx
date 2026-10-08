import db from "@/lib/db";
import Link from "next/link";
import { getClub } from "@/lib/getUserGoHome";
import MatchResultsClient from "./MatchResultsClient";

export default async function MatchResultsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string; date: string }>;
    searchParams: Promise<{ player?: string; from?: string }>;
}) {
    const { id, date } = await params;
    const { player, from } = await searchParams;
    const clubId = Number(id);
    const initialPlayerId = player ? Number(player) : null;
    const backHref =
        from === "manyOpponents"
            ? `/home/${clubId}/gameReview/${date}/manyOpponents`
            : `/home/${clubId}/gameReview/${date}`;

    // KST 기준으로 해당 날짜의 시작과 끝을 설정합니다.
    const dayStart = new Date(`${date}T00:00:00+09:00`);
    const dayEnd = new Date(`${date}T23:59:59.999+09:00`);

    const matchesOnDate = await db.match.findMany({
        where: {
            clubid: clubId,
            endTime: {
                gte: dayStart,
                lt: dayEnd,
            },
        },
        orderBy: { id: "desc" },
    });

    const club = await getClub(clubId);
    const players = club?.players || [];

    const matches = matchesOnDate.map((m) => ({
        id: m.id,
        player1id: m.player1id,
        player2id: m.player2id,
        player3id: m.player3id,
        player4id: m.player4id,
        winner1id: m.winner1id,
        winner2id: m.winner2id,
        endTime: m.endTime ? m.endTime.toISOString() : null,
    }));

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl mb-8 gap-4">
                <h1 className="text-3xl font-bold text-blue-600">{date} 경기 결과 🏸</h1>
                <Link
                    href={backHref}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                    돌아가기
                </Link>
            </div>

            <MatchResultsClient players={players} matches={matches} initialPlayerId={initialPlayerId} />
        </div>
    );
}
