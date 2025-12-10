import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/getUserGoHome";
import MyDraftPanel from "@/app/fantasy/draft/[leagueid]/MyDraftPanel";
import PlayerListPanel from "@/app/fantasy/draft/[leagueid]/PlayerListPanel";
import OtherParticipantsPanel from "@/app/fantasy/draft/[leagueid]/OtherParticipantsPanel";
import RealtimeDraftUpdater from "./RealtimeDraftUpdater";
import TurnNotifier from "./TurnNotifier";
import Link from "next/link";
import Image from "next/image";
/**
 * 특정 리그의 연도에 해당하는 판타지 선수 목록을 가져옵니다.
 * @param leagueId - 판타지 리그의 ID
 * @returns 리그 정보와 해당 연도의 선수 목록을 포함하는 객체. 리그가 없으면 null을 반환합니다.
 */
async function getLeagueWithPlayers(leagueId: number) {
    const league = await db.fantasyLeague.findUnique({
        where: { id: leagueId },
        include: {
            participants: {
                select: {
                    id: true,
                    nickName: true,
                },
            },
            draftPicks: {
                orderBy: { createdAt: "asc" },
                include: {
                    player: true,
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

    return { league, players, draftPicks: league?.draftPicks ?? [] };
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

    const { league, players, draftPicks } = data;
    const isCurrentUserTurn = league.orderList[league.currentUser!] === user.id;
    const isParticipant = league.participants.some((p) => p.id === user.id);

    // 참가자가 아니면 페이지 접근을 막습니다.
    if (!isParticipant) {
        console.log("참가자가 아니므로 드래프트 페이지에 접근할 수 없습니다.");
        redirect(`/fantasy/${league.id}`);
    }

    const myDrafts = draftPicks.filter((d) => d.userId === user.id);

    // 현재 사용자를 제외한 다른 참가자 목록
    const otherUsers = league.participants.filter((p) => p.id !== user?.id);

    // 선수들을 event 별로 그룹화합니다.
    const groupedPlayers = players.reduce((acc, player) => {
        const event = player.event;
        // 이미 드래프트된 선수는 목록에 포함하지 않습니다.
        // 이 부분은 드래프트된 선수를 회색으로 표시하는 로직으로 대체합니다.
        // if (draftPicks.some((p) => p.playerId === player.id)) return acc;
        if (!acc[event]) {
            acc[event] = [];
        }
        acc[event].push(player);
        return acc;
    }, {} as Record<string, typeof players>);

    const draftedPlayerIds = new Set(draftPicks.map((pick) => pick.playerId));

    return (
        <div className="flex flex-col h-screen">
            <header className="flex justify-between items-center p-4 border-b bg-white z-10 w-full">
                <Link href={`/fantasy/${user.id}`} className="flex items-center gap-2">
                    <Image src="/logo512.png" alt="Logo" width={40} height={40} />
                </Link>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <TurnNotifier isCurrentUserTurn={isCurrentUserTurn} />
                <MyDraftPanel
                    user={user}
                    categories={draftCategories}
                    isCurrentUser={isCurrentUserTurn}
                    drafts={myDrafts}
                />
                <PlayerListPanel
                    groupedPlayers={groupedPlayers}
                    isCurrentUser={isCurrentUserTurn}
                    leagueId={leagueId}
                    userId={user.id}
                    draftedPlayerIds={draftedPlayerIds}
                    myDrafts={myDrafts}
                />
                <div className="flex-1 border-l p-4">
                    <OtherParticipantsPanel
                        otherUsers={otherUsers}
                        categories={draftCategories}
                        currentUser={league.currentUser}
                        leagueId={leagueId}
                        drafts={draftPicks}
                    />
                </div>
                <RealtimeDraftUpdater leagueId={leagueId} />
            </div>
        </div>
    );
}
