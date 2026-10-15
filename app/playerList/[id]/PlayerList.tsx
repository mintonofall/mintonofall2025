"use client";
import PlayerCard from "@/app/component/PlayerCard";
import { Player } from "@/lib/interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deletePlayer, claimPlayerIdentity } from "./action";
import getSessionClient from "@/lib/sessionClient";

export default function PlayerListComponent({ playerList, id }: { playerList: Player[]; id: number }) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [claimingId, setClaimingId] = useState<number | null>(null);
    useEffect(() => {
        setPlayers(playerList);
    }, [playerList]);

    useEffect(() => {
        getSessionClient().then((session) => setMyUserId(session?.id ?? null));
    }, []);

    const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleDelete = async (playerId: number) => {
        if (confirm("정말 이 플레이어를 삭제하시겠습니까?")) {
            await deletePlayer(playerId, id);
            setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== playerId));
        }
    };

    const handleClaimClick = async (player: Player) => {
        if (!myUserId) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (claimingId !== null) return;
        setClaimingId(player.id);
        try {
            const result = await claimPlayerIdentity(myUserId, player.id, id);
            if ("error" in result) {
                alert(result.error);
                return;
            }
            // 같은 클럽의 다른 선수에 걸려 있던 연결은 해제하고, 선택한 선수에만 연결/정보를 반영합니다.
            setPlayers((prev) =>
                prev.map((p) => {
                    if (p.id === player.id)
                        return {
                            ...p,
                            linkedUserId: myUserId,
                            mbti: result.player.mbti,
                            saju: result.player.saju,
                            style: result.player.style,
                            avater: result.player.avater,
                        };
                    if (p.linkedUserId === myUserId) return { ...p, linkedUserId: null };
                    return p;
                }),
            );
        } catch (error) {
            console.error("선수 지정 중 오류가 발생했습니다:", error);
            alert("선수 지정에 실패했습니다.");
        } finally {
            setClaimingId(null);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col justify-between items-center mb-4">
                <div>
                    <Link
                        href={"/createPlayer/" + id}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-2"
                    >
                        선수등록
                    </Link>
                    <Link
                        href={"/home/" + id}
                        className="bg-blue-500 text-white px-4 py-2 mx-2 rounded hover:bg-blue-600"
                    >
                        게임판으로
                    </Link>
                </div>
                <input
                    type="text"
                    placeholder="Search players"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded m-4"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlayers.map((player) => {
                    const isMine = !!myUserId && player.linkedUserId === myUserId;
                    const claimedByOther = !!player.linkedUserId && !isMine;
                    return (
                        <div key={player.id} className="bg-white shadow-md rounded p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <PlayerCard {...player} showBadges />
                                <div className="flex gap-4">
                                    <Link
                                        href={`/editPlayer/${player.id}`}
                                        className="text-gray-500 hover:text-blue-500"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(player.id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                {claimedByOther && (
                                    <span className="text-[10px] text-gray-400">다른 분이 지정한 선수예요</span>
                                )}
                                <button
                                    onClick={() => handleClaimClick(player)}
                                    disabled={claimingId === player.id}
                                    className={`text-xs font-semibold px-2 py-1 rounded ml-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isMine
                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {claimingId === player.id ? "저장 중..." : isMine ? "나예요 ✓" : "이게 나에요"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
