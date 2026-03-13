/**
 * @file /app/home/[id]/GameResultModal.tsx
 * @description 경기 종료 후 승자를 기록하는 모달 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useEffect, useState } from "react";

/**
 * GameResultModal 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달 닫기 함수
 * @param {any} props.players - 경기에 참여한 선수 정보 (p1, p2, p3, p4 포함)
 * @param {(winners: string[]) => void} props.onConfirm - 승자 확정 함수
 */
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
    /** @type {string[]} 승자로 선택된 선수의 키('p1', 'p2', 'p3', 'p4')를 저장하는 상태 */
    const [winners, setWinners] = useState<string[]>([]);

    /**
     * 모달이 열릴 때마다 승자 선택 상태를 초기화합니다.
     */
    useEffect(() => {
        if (isOpen) {
            setWinners([]);
        }
    }, [isOpen]);

    /**
     * 선수 버튼 클릭 시 승자 목록에 추가/제거하는 핸들러
     * @param {string} playerKey - 클릭된 선수의 키 ('p1', 'p2', 'p3', 'p4')
     */
    const handlePlayerClick = (playerKey: string) => {
        if (winners.includes(playerKey)) {
            setWinners((prev) => prev.filter((k) => k !== playerKey));
        } else {
            if (winners.length < 2) {
                setWinners((prev) => [...prev, playerKey]);
            }
        }
    };

    // 모달이 닫혀있거나 선수 정보가 없으면 아무것도 렌더링하지 않음
    if (!isOpen || !players) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80 relative shadow-xl">
                <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <span className="text-2xl font-bold">✕</span>
                </button>
                <h2 className="text-xl font-bold text-center mb-6">경기 결과 기록</h2>
                <h2 className="text-sm text-center mb-6">승리자를 선택하세요</h2>

                {/* 4명의 선수 버튼 */}
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

                {/* 결과 입력 버튼 */}
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
