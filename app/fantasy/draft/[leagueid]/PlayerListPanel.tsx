"use client";

import { FantasyPlayer } from "@prisma/client";
interface DraftPick {
    category: string;
    player: FantasyPlayer;
}

import Image from "next/image";
import { draftPlayer } from "./actions";
import { useTransition } from "react";

interface PlayerListPanelProps {
    groupedPlayers: Record<string, FantasyPlayer[]>;
    isCurrentUser: boolean;
    leagueId: number;
    userId: number;
    draftedPlayerIds: Set<number>;
    myDrafts: DraftPick[];
}

export default function PlayerListPanel({
    groupedPlayers,
    isCurrentUser,
    leagueId,
    userId,
    draftedPlayerIds,
    myDrafts,
}: PlayerListPanelProps) {
    const [isPending, startTransition] = useTransition();

    const handlePlayerDraft = (player: FantasyPlayer) => {
        if (isCurrentUser && !isPending && !draftedPlayerIds.has(player.id)) {
            const draftedCategories = myDrafts.map((d) => d.category);
            const isCategoryTaken = draftedCategories.includes(player.event);
            const isWildcardTaken = draftedCategories.includes("와일드카드");

            if (isCategoryTaken) {
                if (isWildcardTaken) {
                    alert("해당 종목의 선수를 픽할 수 없습니다. (와일드카드 슬롯도 사용 중)");
                    return;
                }
                const confirmWildcard = window.confirm(
                    "이미 해당 종목의 선수가 있습니다. 와일드 카드로 픽 하시겠습니까?"
                );
                if (confirmWildcard) {
                    startTransition(async () => {
                        await draftPlayer(leagueId, player.id, userId, player.event, true);
                    });
                }
            } else {
                startTransition(async () => {
                    await draftPlayer(leagueId, player.id, userId, player.event, false);
                });
            }
        }
    };

    return (
        <div className="w-3/5 flex flex-col bg-white h-screen">
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                {/* <h3 className="text-md font-bold mb-2">{league.leagueName} - 드래프트</h3> */}
                {/* <p className="text-xl text-gray-600">{league.year}년도 선수 목록</p> */}
            </div>
            <div className="flex-grow overflow-y-auto p-4">
                {Object.entries(groupedPlayers).map(([event, players]) => (
                    <div key={event} className="mb-8">
                        {/* <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 sticky top-0 bg-white py-2">
                        {event}
                    </h2> */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {players.map((player) => (
                                <div key={player.id} onClick={() => handlePlayerDraft(player)}>
                                    <div
                                        className={`border rounded-lg p-2 shadow-sm transition-shadow 
                                        ${isPending ? "opacity-50" : ""}
                                        ${
                                            draftedPlayerIds.has(player.id)
                                                ? "cursor-not-allowed bg-gray-300 opacity-50"
                                                : isCurrentUser
                                                ? "cursor-pointer hover:shadow-md hover:bg-blue-50"
                                                : "cursor-not-allowed bg-gray-100"
                                        }
                                        
                                    `}
                                    >
                                        {player.photo ? (
                                            <div className="relative w-full h-20 mb-2 overflow-hidden rounded-md">
                                                <Image
                                                    src={player.photo}
                                                    alt={player.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-20 mb-2 bg-gray-200 rounded-md"></div>
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
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
