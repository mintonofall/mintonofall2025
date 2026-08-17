"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllUsers, updateUserPoint } from "@/lib/getUserGoHome";

interface UserRow {
    id: number;
    userName: string;
    nickName: string;
    point: number;
}

export default function UserPointPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editValues, setEditValues] = useState<Record<number, string>>({});
    const [savingId, setSavingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return users;
        return users.filter(
            (u) => u.userName.toLowerCase().includes(keyword) || (u.nickName || "").toLowerCase().includes(keyword),
        );
    }, [users, search]);

    const startEditing = (user: UserRow) => {
        setEditValues((prev) => ({ ...prev, [user.id]: String(user.point) }));
    };

    const cancelEditing = (userId: number) => {
        setEditValues((prev) => {
            const next = { ...prev };
            delete next[userId];
            return next;
        });
    };

    const handleSave = async (userId: number) => {
        const rawValue = editValues[userId];
        if (rawValue === undefined) return;
        const newPoint = Number(rawValue);
        if (!Number.isFinite(newPoint) || newPoint < 0) {
            alert("올바른 포인트 값을 입력해주세요.");
            return;
        }

        setSavingId(userId);
        try {
            const updated = await updateUserPoint(userId, newPoint);
            setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
            cancelEditing(userId);
        } catch (error) {
            console.error("포인트 수정 실패:", error);
            alert("포인트 수정 중 오류가 발생했습니다.");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">유저 포인트 관리</h1>
                <input
                    type="text"
                    placeholder="아이디 또는 닉네임 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full mb-4 outline-none focus:border-blue-500"
                />

                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">로딩 중...</div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filteredUsers.map((user) => {
                            const isEditing = editValues[user.id] !== undefined;
                            return (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded border border-gray-200"
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-semibold text-gray-800 truncate">{user.userName}</span>
                                        <span className="text-xs text-gray-500 truncate">{user.nickName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editValues[user.id]}
                                                onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [user.id]: e.target.value }))
                                                }
                                                className="border border-gray-300 rounded px-2 py-1 text-sm w-28 text-right outline-none focus:border-blue-500"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-bold text-blue-600 w-28 text-right">
                                                {user.point.toLocaleString()} P
                                            </span>
                                        )}
                                        {isEditing ? (
                                            <>
                                                <button
                                                    disabled={savingId === user.id}
                                                    onClick={() => handleSave(user.id)}
                                                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                                                >
                                                    {savingId === user.id ? "저장 중..." : "저장"}
                                                </button>
                                                <button
                                                    onClick={() => cancelEditing(user.id)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                                                >
                                                    취소
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(user)}
                                                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                                            >
                                                수정
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {filteredUsers.length === 0 && (
                            <div className="text-center text-gray-500 py-10">검색 결과가 없습니다.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
