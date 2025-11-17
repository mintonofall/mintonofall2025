"use client";

interface MyDraftPanelProps {
    user: { nickName: string | null };
    categories: string[];
    isCurrentUser: boolean;
}

export default function MyDraftPanel({ user, categories, isCurrentUser }: MyDraftPanelProps) {
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
                        <h3 className="font-semibold text-lg text-gray-800">{category}</h3>
                        {/* 여기에 선택된 선수가 표시됩니다. */}
                    </div>
                ))}
            </div>
        </div>
    );
}
