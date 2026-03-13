import { useEffect, useState } from "react";
import { getPlayerMatches } from "@/lib/getUserGoHome";

export default function PlayerHistoryModal({
    isOpen,
    onClose,
    player,
}: {
    isOpen: boolean;
    onClose: () => void;
    player: any;
}) {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && player && player.id) {
            setLoading(true);
            getPlayerMatches(player.id)
                .then((data) => {
                    setMatches(data);
                    setLoading(false);
                })
                .catch((e) => {
                    console.error("Failed to fetch player matches", e);
                    setLoading(false);
                });
        }
    }, [isOpen, player]);

    if (!isOpen || !player) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
            <div
                className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] flex flex-col shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold">{player.name} - 경기 기록</h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <span className="text-2xl font-bold">✕</span>
                    </button>
                </div>
                <div className="overflow-y-auto">
                    {loading ? (
                        <p className="text-center text-gray-500">기록을 불러오는 중...</p>
                    ) : matches.length === 0 ? (
                        <p className="text-center text-gray-500">경기 기록이 없습니다.</p>
                    ) : (
                        <div className="space-y-3">
                            {matches.map((match) => {
                                const team1 = [match.player1, match.player2];
                                const team2 = [match.player3, match.player4];
                                const isWinnerTeam1 =
                                    match.winner1id === team1[0]?.id || match.winner1id === team1[1]?.id;
                                const isDraw = !match.winner1id;

                                return (
                                    <div key={match.id} className="border rounded p-3 bg-gray-50">
                                        <p className="text-xs text-gray-500 mb-2">
                                            {new Date(match.endTime).toLocaleString("ko-KR")}
                                        </p>
                                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                            {[...team1, ...team2].map((p, idx) => {
                                                const isWinner =
                                                    !isDraw &&
                                                    ((idx < 2 && isWinnerTeam1) || (idx >= 2 && !isWinnerTeam1));
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`p-1 rounded ${isWinner ? "bg-blue-200 font-bold" : "bg-white border"}`}
                                                    >
                                                        {p?.name || "-"}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
