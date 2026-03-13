import { useEffect, useState } from "react";

export default function AddPlayerModal({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (player: any) => void;
}) {
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        age: "",
        grade: "",
        gender: "man",
        isJoinLeague: false,
    });

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4">선수 추가</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">나이</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.age}
                            onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                        />
                    </div>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">급수</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.grade}
                            onChange={(e) => setNewPlayer({ ...newPlayer, grade: e.target.value })}
                        />
                    </div>
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
                <div className="mt-6 flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={onClose}>
                        취소
                    </button>
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
