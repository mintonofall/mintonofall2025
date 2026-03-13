/**
 * @file /app/home/[id]/EditPlayerModal.tsx
 * @description 선수 정보를 수정하는 모달 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useState, useEffect } from "react";

/**
 * EditPlayerModal 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달 닫기 함수
 * @param {any} props.player - 수정할 선수 정보
 * @param {(updatedPlayer: any) => void} props.onConfirm - 선수 정보 수정 확인 함수
 */
export default function EditPlayerModal({
    isOpen,
    onClose,
    player,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    player: any;
    onConfirm: (updatedPlayer: any) => void;
}) {
    /** @type {any | null} 수정 중인 선수 정보를 담는 상태 */
    const [editedPlayer, setEditPlayer] = useState<any>(null);

    /**
     * `player` prop이 변경될 때마다 `editedPlayer` 상태를 업데이트합니다.
     * 모달이 열릴 때 전달받은 선수 정보로 폼을 초기화하는 역할을 합니다.
     */
    useEffect(() => {
        setEditPlayer(player);
    }, [player]);

    // 모달이 닫혀있거나 수정할 선수 정보가 없으면 아무것도 렌더링하지 않음
    if (!isOpen || !editedPlayer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4">선수 정보 수정</h2>
                <div className="flex flex-col gap-4">
                    {/* 이름 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.name || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, name: e.target.value })}
                        />
                    </div>
                    {/* 나이 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">나이</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.age || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, age: e.target.value })}
                        />
                    </div>
                    {/* 급수 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">급수</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.grade || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, grade: e.target.value })}
                        />
                    </div>
                    {/* 리그 참가 여부 체크박스 */}
                    <div className="flex items-center">
                        <input
                            id="isJoinLeague"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={editedPlayer.isJoinLeague || false}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, isJoinLeague: e.target.checked })}
                        />
                        <label htmlFor="isJoinLeague" className="ml-2 block text-sm text-gray-900">
                            리그 참가
                        </label>
                    </div>
                </div>
                {/* 하단 버튼 (취소, 저장) */}
                <div className="mt-6 flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => onConfirm(editedPlayer)}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
