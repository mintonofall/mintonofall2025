"use client";

import Image from "next/image";
import { FantasyPlayer } from "@prisma/client";

interface DraftPick {
    category: string;
    player: FantasyPlayer;
}
interface MyDraftPanelProps {
    user: { nickName: string | null };
    categories: string[];
    isCurrentUser: boolean;
    drafts: DraftPick[];
}

export default function MyDraftPanel({ user, categories, isCurrentUser, drafts }: MyDraftPanelProps) {
    return (
        <div
            className={`w-1/5 p-4 border-r border-gray-200 flex flex-col ${
                isCurrentUser ? "bg-green-100" : "bg-gray-50"
            }`}
        >
            <h2 className="text-2xl font-bold mb-4 text-center">{user?.nickName}님의 드래프트</h2>
            <div className="flex-grow flex flex-col space-y-3">
                {categories.map((category) => {
                    const draft = drafts.find((d) => d.category === category);
                    return (
                        <div key={category} className="flex-grow p-4 border rounded-lg shadow-sm bg-white">
                            <h3 className="font-semibold text-lg text-gray-800">{category}</h3>
                            {draft ? (
                                <div className="flex items-center space-x-2 mt-2">
                                    <div>
                                        <Image
                                            src={draft.player.photo!}
                                            alt={draft.player.name}
                                            width={100}
                                            height={50}
                                            className="rounded-lg object-cover"
                                            unoptimized={true}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{draft.player.name}</p>
                                        <p className="text-sm text-gray-500">Rank: {draft.player.ranking}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 text-gray-500">선수 없음</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
