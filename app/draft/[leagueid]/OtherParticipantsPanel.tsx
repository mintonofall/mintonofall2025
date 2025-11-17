"use client";

interface OtherParticipantsPanelProps {
    otherUsers: { id: number; nickName: string | null }[];
    categories: string[];
    currentUser: number | null;
}

export default function OtherParticipantsPanel({ otherUsers, categories, currentUser }: OtherParticipantsPanelProps) {
    return (
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
}
