import db from "@/lib/db";
import { getClub, getUser } from "@/lib/getUserGoHome";
import { getSavedDiaryMatchIds } from "@/lib/getClubDiary";
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

    const user = await getUser();
    const savedMatchIds = user?.id ? await getSavedDiaryMatchIds(user.id, matches.map((m) => m.id)) : [];

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <MatchResultsClient
                date={date}
                backHref={backHref}
                players={players}
                matches={matches}
                initialPlayerId={initialPlayerId}
                userId={user?.id ?? null}
                initialSavedMatchIds={savedMatchIds}
            />
        </div>
    );
}
