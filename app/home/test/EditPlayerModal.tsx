import { useState, useEffect } from "react";

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
    const [editedPlayer, setEditPlayer] = useState<any>(null);

    useEffect(() => {
        setEditPlayer(player);
    }, [player]);

    if (!isOpen || !editedPlayer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4">선수 정보 수정</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.name || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">나이</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.age || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, age: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">급수</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.grade || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, grade: e.target.value })}
                        />
                    </div>
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
