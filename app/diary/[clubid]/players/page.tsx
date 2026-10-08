"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPlayersFromClub, updatePlayerDiary, deletePlayerDiary, setMainPlayer } from "@/lib/getClubDiary";
import { PlayerDiary } from "@/lib/interface";
import getSessionClient from "@/lib/sessionClient";

const AGE_OPTIONS = [20, 30, 40, 50, 60];
const GRADE_OPTIONS = ["S", "A", "B", "C", "D", "E"];

export default function DiaryPlayersPage({ params }: { params: Promise<{ clubid: string }> }) {
    const [clubid, setClubid] = useState<string | null>(null);
    const [userid, setUserid] = useState<number>(0);
    const [players, setPlayers] = useState<PlayerDiary[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<{ name: string; age: number; grade: string; gender: string }>({
        name: "",
        age: 40,
        grade: "A",
        gender: "man",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            setClubid(resolvedParams.clubid);
            const session = await getSessionClient();
            setUserid(Number(session!.id));
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchPlayers() {
            if (userid === 0) return;
            const data = await getPlayersFromClub(userid);
            setPlayers(data);
        }
        fetchPlayers();
    }, [userid]);

    function startEdit(player: PlayerDiary) {
        setEditingId(player.id);
        setEditForm({
            name: player.name,
            age: player.age ?? 40,
            grade: player.grade ?? "A",
            gender: player.gender ?? "man",
        });
    }

    function cancelEdit() {
        setEditingId(null);
    }

    async function saveEdit(id: number) {
        if (!editForm.name.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }
        setIsSaving(true);
        try {
            await updatePlayerDiary(id, {
                name: editForm.name.trim(),
                age: editForm.age,
                grade: editForm.grade,
                gender: editForm.gender,
            });
            setPlayers((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? { ...p, name: editForm.name.trim(), age: editForm.age, grade: editForm.grade, gender: editForm.gender }
                        : p,
                ),
            );
            setEditingId(null);
        } catch (error) {
            console.error("선수 수정 중 오류가 발생했습니다:", error);
            alert("선수 수정에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("정말 이 선수를 삭제하시겠습니까?")) return;
        try {
            await deletePlayerDiary(id);
            setPlayers((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("선수 삭제 중 오류가 발생했습니다:", error);
            alert("선수 삭제에 실패했습니다.");
        }
    }

    async function handleSetMain(id: number) {
        if (!userid) return;
        try {
            await setMainPlayer(userid, id);
            setPlayers((prev) => prev.map((p) => ({ ...p, isMe: p.id === id })));
        } catch (error) {
            console.error("주인공 설정 중 오류가 발생했습니다:", error);
            alert("주인공 설정에 실패했습니다.");
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-center flex-1">선수 목록 편집</h1>
            </div>
            <div className="flex flex-col gap-2 max-w-2xl mx-auto">
                {players.map((player) => {
                    const isEditing = editingId === player.id;
                    return (
                        <div key={player.id} className="bg-white rounded-lg shadow p-3">
                            {isEditing ? (
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div>
                                            <span className="block text-sm font-medium text-gray-700 mb-1">나이</span>
                                            <select
                                                value={editForm.age}
                                                onChange={(e) =>
                                                    setEditForm((f) => ({ ...f, age: Number(e.target.value) }))
                                                }
                                                className="p-2 border border-gray-300 rounded"
                                            >
                                                {AGE_OPTIONS.map((age) => (
                                                    <option key={age} value={age}>
                                                        {age}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-medium text-gray-700 mb-1">성별</span>
                                            <div className="flex gap-2">
                                                <label className="flex items-center gap-1 text-sm">
                                                    <input
                                                        type="radio"
                                                        name={`gender-${player.id}`}
                                                        checked={editForm.gender === "man"}
                                                        onChange={() => setEditForm((f) => ({ ...f, gender: "man" }))}
                                                    />
                                                    남성
                                                </label>
                                                <label className="flex items-center gap-1 text-sm">
                                                    <input
                                                        type="radio"
                                                        name={`gender-${player.id}`}
                                                        checked={editForm.gender === "woman"}
                                                        onChange={() =>
                                                            setEditForm((f) => ({ ...f, gender: "woman" }))
                                                        }
                                                    />
                                                    여성
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-medium text-gray-700 mb-1">등급</span>
                                            <div className="flex gap-2 flex-wrap">
                                                {GRADE_OPTIONS.map((grade) => (
                                                    <label key={grade} className="flex items-center gap-1 text-sm">
                                                        <input
                                                            type="radio"
                                                            name={`grade-${player.id}`}
                                                            checked={editForm.grade === grade}
                                                            onChange={() => setEditForm((f) => ({ ...f, grade }))}
                                                        />
                                                        {grade}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => saveEdit(player.id)}
                                            disabled={isSaving}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded disabled:bg-gray-300"
                                        >
                                            {isSaving ? "저장 중..." : "저장"}
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            disabled={isSaving}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {player.name}{" "}
                                            {player.isMe && (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">
                                                    주인공
                                                </span>
                                            )}
                                        </h2>
                                        <div className="flex gap-2 text-sm text-gray-600">
                                            <span>{player.age}</span>
                                            <span>{player.grade}</span>
                                            <span>{player.gender === "man" ? "남성" : "여성"}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        {!player.isMe && (
                                            <button
                                                onClick={() => handleSetMain(player.id)}
                                                className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded hover:bg-yellow-100"
                                            >
                                                주인공으로 설정
                                            </button>
                                        )}
                                        <button
                                            onClick={() => startEdit(player)}
                                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(player.id)}
                                            className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {players.length === 0 && (
                    <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow">
                        등록된 선수가 없습니다.
                    </div>
                )}
            </div>
            {clubid && (
                <div className="max-w-2xl mx-auto mt-4 flex gap-2">
                    <Link
                        href={{ pathname: `/diary/${clubid}/create`, query: { userid } }}
                        className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
                    >
                        선수 추가
                    </Link>
                    <Link
                        href={`/diary/${clubid}`}
                        className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded"
                    >
                        돌아가기
                    </Link>
                </div>
            )}
        </div>
    );
}
