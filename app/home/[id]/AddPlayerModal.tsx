/**
 * @file /app/home/[id]/AddPlayerModal.tsx
 * @description 신규 선수를 추가하는 모달 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useEffect, useState } from "react";

/**
 * AddPlayerModal 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달 닫기 함수
 * @param {(player: any) => void} props.onConfirm - 선수 추가 확인 함수
 */
export default function AddPlayerModal({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (player: any) => void;
}) {
    /** @type {object} 새로 추가할 선수의 정보를 담는 상태 */
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        age: "",
        grade: "",
        gender: "man",
        isJoinLeague: false,
    });

    /**
     * 모달이 열릴 때마다 입력 폼을 초기화합니다.
     */
    useEffect(() => {
        if (isOpen) {
            setNewPlayer({
                name: "",
                age: "",
                grade: "",
                gender: "man",
                isJoinLeague: false,
            });
        }
    }, [isOpen]);

    // 모달이 닫혀있으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4">선수 추가</h2>
                <div className="flex flex-col gap-4">
                    {/* 이름 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        />
                    </div>
                    {/* 나이 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">나이</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.age}
                            onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                        />
                    </div>
                    {/* 성별 선택 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">성별</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.gender}
                            onChange={(e) => setNewPlayer({ ...newPlayer, gender: e.target.value })}
                        >
                            <option value="man">남성</option>
                            <option value="woman">여성</option>
                        </select>
                    </div>
                    {/* 급수 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">급수</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.grade}
                            onChange={(e) => setNewPlayer({ ...newPlayer, grade: e.target.value })}
                        />
                    </div>
                    {/* 리그 참가 여부 체크박스 */}
                    <div className="flex items-center">
                        <input
                            id="isJoinLeagueAdd"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={newPlayer.isJoinLeague}
                            onChange={(e) => setNewPlayer({ ...newPlayer, isJoinLeague: e.target.checked })}
                        />
                        <label htmlFor="isJoinLeagueAdd" className="ml-2 block text-sm text-gray-900">
                            리그 참가
                        </label>
                    </div>
                </div>
                {/* 하단 버튼 (취소, 추가) */}
                <div className="mt-6 flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={onClose}>
                        취소
                    </button>
                    {/* 추가 버튼 클릭 시 급수 유효성 검사 후 onConfirm 호출 */}
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => {
                            const validGrades = ["A", "B", "C", "D", "E", "S"];
                            if (!validGrades.includes(newPlayer.grade)) {
                                alert("급수는 A, B, C, D, E, S 중 하나여야 합니다.");
                                return;
                            }
                            onConfirm(newPlayer);
                        }}
                    >
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
}
