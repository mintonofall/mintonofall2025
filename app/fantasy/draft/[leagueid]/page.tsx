import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { FantasyPlayer } from "@prisma/client";
import { getUser } from "@/lib/getUserGoHome";
import Image from "next/image";

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

export default async function DraftPage({ params }: { params: { leagueid: string } }) {
    const user = await getUser();
    const leagueId = Number(params.leagueid);

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

// 좌측 패널: 나의 드래프트 현황
const MyDraftPanel = ({
    user,
    categories,
    isCurrentUser,
}: {
    user: { nickName: string | null };
    categories: string[];
    isCurrentUser: boolean;
}) => (
    <div
        className={`w-1/5 p-4 border-r border-gray-200 flex flex-col ${isCurrentUser ? "bg-green-100" : "bg-gray-50"}`}
    >
        <h2 className="text-2xl font-bold mb-4 text-center">{user?.nickName}님의 드래프트</h2>
        <div className="flex-grow flex flex-col space-y-3">
            {categories.map((category) => (
                <div key={category} className="flex-grow p-4 border rounded-lg shadow-sm bg-white">
                    <h3 className="font-semibold text-lg text-gray-800">{category}</h3>
                    {/* 여기에 선택된 선수가 표시됩니다. */}
                </div>
            ))}
        </div>
    </div>
);

// 중앙 패널: 선수 목록
const PlayerListPanel = ({ groupedPlayers }: { groupedPlayers: Record<string, FantasyPlayer[]> }) => (
    <div className="w-3/5 flex flex-col bg-white h-screen">
        <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
            {/* <h3 className="text-md font-bold mb-2">{league.leagueName} - 드래프트</h3> */}
            {/* <p className="text-xl text-gray-600">{league.year}년도 선수 목록</p> */}
        </div>
        <div className="flex-grow overflow-y-auto p-4">
            {Object.entries(groupedPlayers).map(([event, playersInEvent]) => (
                <div key={event} className="mb-8">
                    {/* <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 sticky top-0 bg-white py-2">
                        {event}
                    </h2> */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {playersInEvent.map((player) => (
                            <div
                                key={player.id}
                                className="border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                {player.photo && (
                                    <div className="relative w-full h-20 mb-2 overflow-hidden rounded-md">
                                        <Image src={player.photo} alt={player.name} fill className="object-cover" />
                                    </div>
                                )}
                                <h3 className="text-md font-semibold">
                                    {player.name.includes("/")
                                        ? player.name.split("/").map((part, index) => (
                                              <span key={index}>
                                                  {part.trim()}
                                                  {index < player.name.split("/").length - 1 && <br />}
                                              </span>
                                          ))
                                        : player.name}
                                </h3>
                                <p className="text-xs text-gray-500">랭킹: {player.ranking}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// 우측 패널: 다른 참가자 현황
const OtherParticipantsPanel = ({
    otherUsers,
    categories,
    currentUser,
}: {
    otherUsers: { id: number; nickName: string | null }[];
    categories: string[];
    currentUser: number | null;
}) => (
    <div className="w-1/5 p-4 border-l border-gray-200 flex flex-col bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-center">다른 참가자</h2>
        <div className="flex-grow flex flex-col space-y-3">
            {otherUsers.length > 0 ? (
                otherUsers.map((otherUser) => {
                    const isCurrentUser = otherUser.id === currentUser;
                    return (
                        <div
                            key={otherUser.id}
                            className={`flex-grow p-3 border rounded-lg shadow-sm flex flex-col ${
                                isCurrentUser ? "bg-green-100" : "bg-white"
                            }`}
                        >
                            <h3 className="font-semibold text-lg text-gray-800 mb-2 text-center">
                                {otherUser.nickName}
                            </h3>
                            <div className="grid grid-cols-2 grid-rows-3 gap-2 flex-grow">
                                {categories.map((category) => (
                                    <div key={category} className="border rounded p-1 bg-gray-50 text-center">
                                        <h4 className="text-xs font-medium text-gray-700">{category}</h4>
                                        {/* TODO: 다른 참가자가 선택한 선수 정보 */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                    <p>다른 참가자가 없습니다.</p>
                </div>
            )}
        </div>
    </div>
);
