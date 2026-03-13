/**
 * @file /app/home/[id]/PlayerHistoryModal.tsx
 * @description 특정 선수의 경기 기록을 보여주는 모달 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useEffect, useState } from "react";
import { getPlayerMatches } from "@/lib/getUserGoHome";

/**
 * PlayerHistoryModal 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달 닫기 함수
 * @param {any} props.player - 경기 기록을 조회할 선수 정보
 */
export default function PlayerHistoryModal({
    isOpen,
    onClose,
    player,
}: {
    isOpen: boolean;
    onClose: () => void;
    player: any;
}) {
    /** @type {any[]} 조회된 경기 기록 목록 */
    const [matches, setMatches] = useState<any[]>([]);
    /** @type {boolean} 데이터 로딩 상태 */
    const [loading, setLoading] = useState(false);

    /**
     * 모달이 열리고 선수 정보가 있을 때, 해당 선수의 경기 기록을 서버에서 가져옵니다.
     * @dependency isOpen, player
     */
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

    // 모달이 닫혀있거나 선수 정보가 없으면 아무것도 렌더링하지 않음
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
                        // 경기 기록 목록 렌더링
                        <div className="space-y-3">
                            {matches.map((match) => {
                                const team1 = [match.player1, match.player2];
                                const team2 = [match.player3, match.player4];
                                const isWinnerTeam1 =
                                    match.winner1id === team1[0]?.id || match.winner1id === team1[1]?.id;
                                // 승자가 없으면 무승부로 간주
                                const isDraw = !match.winner1id;

                                return (
                                    <div key={match.id} className="border rounded p-3 bg-gray-50">
                                        <p className="text-xs text-gray-500 mb-2">
                                            {new Date(match.endTime).toLocaleString("ko-KR")}
                                        </p>
                                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                            {/* 4명의 선수 정보를 렌더링하며 승리한 선수는 강조 표시 */}
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
