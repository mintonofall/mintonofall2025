import { useEffect, useState } from "react";

export default function GameResultModal({
    isOpen,
    onClose,
    players,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    players: any;
    onConfirm: (winners: string[]) => void;
}) {
    const [winners, setWinners] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setWinners([]);
        }
    }, [isOpen]);

    const handlePlayerClick = (playerKey: string) => {
        if (winners.includes(playerKey)) {
            setWinners((prev) => prev.filter((k) => k !== playerKey));
        } else {
            if (winners.length < 2) {
                setWinners((prev) => [...prev, playerKey]);
            }
        }
    };

    if (!isOpen || !players) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80 relative shadow-xl">
                <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <span className="text-2xl font-bold">✕</span>
                </button>
                <h2 className="text-xl font-bold text-center mb-6">경기 결과 기록</h2>
                <h2 className="text-sm text-center mb-6">승리자를 선택하세요</h2>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        className={`${winners.includes("p1") ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-100 hover:bg-gray-200"} p-3 rounded font-semibold truncate text-gray-800`}
                        onClick={() => handlePlayerClick("p1")}
                    >
                        {players.p1?.name}
                    </button>
                    <button
                        className={`${winners.includes("p2") ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-100 hover:bg-gray-200"} p-3 rounded font-semibold truncate text-gray-800`}
                        onClick={() => handlePlayerClick("p2")}
                    >
                        {players.p2?.name}
                    </button>
                    <button
                        className={`${winners.includes("p3") ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-100 hover:bg-gray-200"} p-3 rounded font-semibold truncate text-gray-800`}
                        onClick={() => handlePlayerClick("p3")}
                    >
                        {players.p3?.name}
                    </button>
                    <button
                        className={`${winners.includes("p4") ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-100 hover:bg-gray-200"} p-3 rounded font-semibold truncate text-gray-800`}
                        onClick={() => handlePlayerClick("p4")}
                    >
                        {players.p4?.name}
                    </button>
                </div>

                <div className="flex justify-center">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold"
                        onClick={() => {
                            if (winners.length === 1) {
                                alert("승리자를 2명을 선택해주세요");
                                return;
                            }
                            onConfirm(winners);
                            onClose();
                        }}
                    >
                        경기 결과 입력
                    </button>
                </div>
            </div>
        </div>
    );
}
