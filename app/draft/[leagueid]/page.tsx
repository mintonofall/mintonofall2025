import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { FantasyPlayer } from "@prisma/client";
import { getUser } from "@/lib/getUserGoHome";
import MyDraftPanel from "@/app/draft/[leagueid]/MyDraftPanel";
import PlayerListPanel from "@/app/draft/[leagueid]/PlayerListPanel";
import OtherParticipantsPanel from "@/app/draft/[leagueid]/OtherParticipantsPanel";
/**
 * 특정 리그의 연도에 해당하는 판타지 선수 목록을 가져옵니다.
 * @param leagueId - 판타지 리그의 ID
 * @returns 리그 정보와 해당 연도의 선수 목록을 포함하는 객체. 리그가 없으면 null을 반환합니다.
 */
async function getLeagueWithPlayers(leagueId: number) {
    const league = await db.fantasyLeague.findUnique({
        where: { id: leagueId },
        select: {
            id: true,
            leagueName: true,
            year: true,
            currentUser: true,
            participants: {
                select: {
                    id: true,
                    nickName: true,
                },
            },
        },
    });

    if (!league) {
        return null;
    }

    const players = await db.fantasyPlayer.findMany({
        where: {
            year: league.year,
        },
        orderBy: [
            { event: "asc" }, // 1. 종목(event) 순으로 정렬
            { ranking: "asc" }, // 2. 랭킹(ranking) 순으로 정렬
        ],
    });

    return { league, players };
}
type PageParams = Promise<{ leagueid: string }>;

export default async function DraftPage({ params }: { params: PageParams }) {
    const { leagueid } = await params;
    const user = await getUser();
    const leagueId = Number(leagueid);

    if (!user || isNaN(leagueId)) {
        return notFound();
    }

    const data = await getLeagueWithPlayers(leagueId);
    const draftCategories = ["MS", "WS", "MD", "WD", "XD", "와일드카드"];

    if (!data) {
        return notFound();
    }

    const { league, players } = data;
    const isParticipant = league.participants.some((p) => p.id === user.id);

    // 참가자가 아니면 페이지 접근을 막습니다.
    if (!isParticipant) {
        console.log("참가자가 아니므로 드래프트 페이지에 접근할 수 없습니다.");
        redirect(`/fantasy/${league.id}`);
    }

    // 현재 사용자를 제외한 다른 참가자 목록
    const otherUsers = league.participants.filter((p) => p.id !== user?.id);

    // 선수들을 event 별로 그룹화합니다.
    const groupedPlayers = players.reduce((acc, player) => {
        const event = player.event;
        if (!acc[event]) {
            acc[event] = [];
        }
        acc[event].push(player);
        return acc;
    }, {} as Record<string, FantasyPlayer[]>);

    return (
        <div className="flex h-screen">
            <MyDraftPanel user={user} categories={draftCategories} isCurrentUser={league.currentUser === user.id} />
            <PlayerListPanel groupedPlayers={groupedPlayers} />
            <OtherParticipantsPanel
                otherUsers={otherUsers}
                categories={draftCategories}
                currentUser={league.currentUser}
            />
        </div>
    );
}
