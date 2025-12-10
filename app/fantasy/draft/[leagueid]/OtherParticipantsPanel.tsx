"use client";

import { FantasyPlayer } from "@prisma/client";

interface DraftPick {
    userId: number;
    category: string;
    player: FantasyPlayer;
}
interface OtherParticipantsPanelProps {
    otherUsers: { id: number; nickName: string | null }[];
    categories: string[];
    currentUser: number | null;
    leagueId: number;
    drafts: DraftPick[];
}

export default function OtherParticipantsPanel({
    otherUsers,
    categories,
    currentUser,
    drafts,
}: OtherParticipantsPanelProps) {
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 text-center flex-shrink-0">다른 참가자</h2>
            <div className="flex-grow flex flex-col space-y-3 overflow-y-auto">
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
                                {categories.map((category) => {
                                    const draft = drafts.find(
                                        (d) => d.userId === otherUser.id && d.category === category
                                    );
                                    return (
                                        <div
                                            key={category}
                                            className="flex items-center space-x-2 p-2 border rounded bg-white text-sm mt-2"
                                        >
                                            <strong className="w-14 flex-shrink-0">{category}:</strong>
                                            {draft ? (
                                                <>
                                                    <img
                                                        src={draft.player.photo!}
                                                        alt={draft.player.name}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <span className="text-xs truncate">
                                                        {draft.player.name} (Rank: {draft.player.ranking})
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-gray-500 ml-1">선수 없음</span>
                                            )}
                                        </div>
                                    );
                                })}
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
}
