"use client";

import { useState } from "react";
import { createDogPlayer, updateDogPlayer, deleteDogPlayer } from "./actions";
import { useRouter } from "next/navigation";

type DogPlayer = {
    id: number;
    name: string;
    where: string | null;
    grade: string | null;
    gameNum: number;
    gender: string | null;
};

export default function PlayerListClient({ players }: { players: DogPlayer[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<DogPlayer | null>(null);
    const router = useRouter();

    const handleEdit = (player: DogPlayer) => {
        setEditingPlayer(player);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            const res = await deleteDogPlayer(id);
            if (res.success) {
                router.refresh();
            } else {
                alert(res.message || "삭제 실패");
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlayer(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        let res;
        if (editingPlayer) {
            res = await updateDogPlayer(editingPlayer.id, formData);
        } else {
            res = await createDogPlayer(formData);
        }

        if (res.success) {
            closeModal();
            router.refresh();
        } else {
            alert(res.message || "작업 실패");
        }
    };

    return (
        <div className="w-full p-4 bg-white min-h-[calc(100vh-4rem)] pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">Player List</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-md"
                >
                    선수 추가
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-2 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">이름</th>
                            <th className="px-2 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                지역
                            </th>
                            <th className="px-2 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                급수
                            </th>
                            <th className="px-2 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                관리
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {players.map((player) => (
                            <tr
                                key={player.id}
                                className={`${player.gender === "man" ? "bg-blue-100" : player.gender === "woman" ? "bg-red-100" : "bg-white"} hover:opacity-80 transition-colors`}
                            >
                                <td className="px-2 py-4 whitespace-nowrap text-lg font-bold text-gray-800">
                                    {player.name}
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap text-center text-gray-600">
                                    {player.where}
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap text-center text-gray-800 font-semibold">
                                    {player.grade}
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => handleEdit(player)}
                                        className="text-blue-600 hover:text-blue-900 mr-3 font-medium"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(player.id)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{editingPlayer ? "선수 수정" : "선수 추가"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingPlayer?.name}
                                    required
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                                <input
                                    type="text"
                                    name="where"
                                    defaultValue={editingPlayer?.where || ""}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">급수</label>
                                <select
                                    name="grade"
                                    defaultValue={editingPlayer?.grade || "C"}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    {["A", "B", "C", "D", "E"].map((g) => (
                                        <option key={g} value={g}>
                                            {g}조
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="man"
                                            defaultChecked={!editingPlayer || editingPlayer.gender === "man"}
                                            className="mr-2"
                                        />
                                        남성
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="woman"
                                            defaultChecked={editingPlayer?.gender === "woman"}
                                            className="mr-2"
                                        />
                                        여성
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
