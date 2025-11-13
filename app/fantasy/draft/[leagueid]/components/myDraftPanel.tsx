"use client";

import { FantasyPlayer } from "@prisma/client";

interface MyDraftPanelProps {
    user: { nickName: string | null; id: number };
    categories: string[];
    myPicks: { category: string; player: FantasyPlayer }[];
    isCurrentUser: boolean;
}

export default function MyDraftPanel({ user, categories, myPicks, isCurrentUser }: MyDraftPanelProps) {
    return (
        <div
            className={`w-1/5 p-4 border-r border-gray-200 flex flex-col ${
                isCurrentUser ? "bg-green-100" : "bg-gray-50"
            }`}
        >
            <h2 className="text-2xl font-bold mb-4 text-center">{user?.nickName}님의 드래프트</h2>
            <div className="flex-grow flex flex-col space-y-3">
                {categories.map((category) => (
                    <div key={category} className="flex-grow p-4 border rounded-lg shadow-sm bg-white">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{category}</h3>
                        {myPicks
                            .filter((pick) => pick.category === category)
                            .map((pick) => (
                                <p key={pick.player.id} className="text-sm text-gray-600">
                                    {pick.player.name}
                                </p>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
