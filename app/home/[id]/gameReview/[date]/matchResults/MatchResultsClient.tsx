"use client";

import { useState } from "react";
import Link from "next/link";
import { saveMatchToMyDiary, saveMatchesToMyDiary } from "@/lib/getClubDiary";

type MatchResultPlayer = {
    id: number;
    name: string;
    avater: string | null;
};

type MatchResult = {
    id: number;
    player1id: number;
    player2id: number;
    player3id: number;
    player4id: number;
    winner1id: number | null;
    winner2id: number | null;
    endTime: string | null;
};

const renderPlayer = (player: MatchResultPlayer | undefined, isWinner: boolean) => {
    if (!player)
        return (
            <div className="bg-white border p-1 rounded shadow-sm flex items-center justify-center text-gray-300 h-full min-h-[60px]">
                -
            </div>
        );
    const avatarSrc = player.avater?.startsWith("https://imagedelivery.net/")
        ? `${player.avater}/avatar`
        : player.avater;
    return (
        <div className="relative h-full">
            {isWinner && (
                <span className="absolute -top-2 -left-1 bg-yellow-400 text-yellow-800 text-[10px] px-1 py-0.5 rounded shadow font-bold z-10">
                    WIN
                </span>
            )}
            <div className="bg-white border p-1 rounded shadow-sm flex flex-col items-center justify-center gap-1 h-full min-h-[60px]">
                {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={avatarSrc}
                        alt={player.name}
                        className="w-10 h-10 rounded-full object-cover bg-gray-100 shadow-sm"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 shadow-sm">
                        No Img
                    </div>
                )}
                <span className="text-xs font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                    {player.name}
                </span>
            </div>
        </div>
    );
};

export default function MatchResultsClient({
    date,
    backHref,
    players,
    matches,
    initialPlayerId = null,
    userId = null,
    initialSavedMatchIds = [],
}: {
    date: string;
    backHref: string;
    players: MatchResultPlayer[];
    matches: MatchResult[];
    initialPlayerId?: number | null;
    userId?: number | null;
    initialSavedMatchIds?: number[];
}) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(initialPlayerId);
    const [savedMatchIds, setSavedMatchIds] = useState<Set<number>>(new Set(initialSavedMatchIds));
    const [savingMatchId, setSavingMatchId] = useState<number | null>(null);
    const [isSavingAll, setIsSavingAll] = useState(false);

    const handleSaveToDiary = async (matchId: number) => {
        if (!userId || savingMatchId !== null) return;
        setSavingMatchId(matchId);
        try {
            const result = await saveMatchToMyDiary(userId, matchId);
            if (result.error) {
                alert(result.error);
                return;
            }
            setSavedMatchIds((prev) => new Set(prev).add(matchId));
        } catch (error) {
            console.error("내 기록으로 저장하는 중 오류가 발생했습니다:", error);
            alert("저장에 실패했습니다.");
        } finally {
            setSavingMatchId(null);
        }
    };

    const handleSaveAllToDiary = async () => {
        if (!userId || isSavingAll || filteredMatches.length === 0) return;
        if (!confirm("정말 저장 하시겠습니까?")) return;

        setIsSavingAll(true);
        try {
            const matchIds = filteredMatches.map((m) => m.id);
            const result = await saveMatchesToMyDiary(userId, matchIds);
            setSavedMatchIds(new Set(matchIds));
            if (result.failedCount > 0) {
                alert(
                    `${result.savedCount}개 저장 완료, ${result.alreadySavedCount}개는 이미 저장됨, ${result.failedCount}개 저장 실패`,
                );
            } else {
                alert(`${result.savedCount}개 저장 완료 (이미 저장된 ${result.alreadySavedCount}개 제외)`);
            }
        } catch (error) {
            console.error("전체 기록을 저장하는 중 오류가 발생했습니다:", error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsSavingAll(false);
        }
    };

    const playerMap = new Map(players.map((p) => [p.id, p]));

    // 오늘 경기에 실제로 참가한 선수만 필터 목록에 노출합니다.
    const participantIds = new Set<number>();
    matches.forEach((m) => {
        [m.player1id, m.player2id, m.player3id, m.player4id].forEach((pid) => {
            if (pid) participantIds.add(pid);
        });
    });
    const participants = players.filter((p) => participantIds.has(p.id));

    const filteredMatches = selectedPlayerId
        ? matches.filter((m) =>
              [m.player1id, m.player2id, m.player3id, m.player4id].includes(selectedPlayerId),
          )
        : matches;

    let summary: {
        total: number;
        wins: number;
        losses: number;
        opponents: { player: MatchResultPlayer; count: number }[];
        neverPlayedWith: MatchResultPlayer[];
    } | null = null;

    if (selectedPlayerId) {
        let wins = 0;
        let losses = 0;
        const partnerCounts = new Map<number, number>();
        const anyMatchWith = new Set<number>();

        filteredMatches.forEach((match) => {
            const matchPlayers = [match.player1id, match.player2id, match.player3id, match.player4id];
            const selectedWon = match.winner1id === selectedPlayerId || match.winner2id === selectedPlayerId;

            if (selectedWon) {
                wins += 1;
            } else if (match.winner1id != null) {
                losses += 1;
            }

            // 코트 슬롯(player1~4) 자리는 팀 편성과 무관하므로, 실제 승자 조합(winner1id/winner2id)으로 팀을 나눕니다.
            if (match.winner1id != null && match.winner2id != null) {
                const winningTeam = [match.winner1id, match.winner2id];
                const myTeam = selectedWon ? winningTeam : matchPlayers.filter((pid) => !winningTeam.includes(pid));
                myTeam.forEach((pid) => {
                    if (pid && pid !== selectedPlayerId) {
                        partnerCounts.set(pid, (partnerCounts.get(pid) || 0) + 1);
                    }
                });
            }

            matchPlayers.forEach((pid) => {
                if (pid && pid !== selectedPlayerId) anyMatchWith.add(pid);
            });
        });

        const opponents = Array.from(partnerCounts.entries())
            .map(([pid, count]) => ({ player: playerMap.get(pid), count }))
            .filter((entry): entry is { player: MatchResultPlayer; count: number } => !!entry.player)
            .sort((a, b) => b.count - a.count);

        // 오늘 경기에 참가했지만 선택한 선수와는 한 번도 같은 경기를 뛰지 않은 선수
        const neverPlayedWith = participants
            .filter((p) => p.id !== selectedPlayerId && !anyMatchWith.has(p.id))
            .sort((a, b) => a.name.localeCompare(b.name));

        summary = { total: filteredMatches.length, wins, losses, opponents, neverPlayedWith };
    }

    return (
        <div className="w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-8 gap-4">
                <h1 className="text-3xl font-bold text-blue-600">{date} 경기 결과 🏸</h1>
                <div className="flex items-center gap-2">
                    <Link
                        href={backHref}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                    >
                        돌아가기
                    </Link>
                    {userId && selectedPlayerId !== null && (
                        <button
                            type="button"
                            onClick={handleSaveAllToDiary}
                            disabled={isSavingAll || filteredMatches.length === 0}
                            className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isSavingAll ? "저장 중..." : "기록저장"}
                        </button>
                    )}
                </div>
            </div>
            <div className="mb-4">
                <select
                    value={selectedPlayerId ?? ""}
                    onChange={(e) => setSelectedPlayerId(e.target.value ? Number(e.target.value) : null)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full outline-none focus:border-blue-500 bg-white shadow-sm"
                >
                    <option value="">전체 선수</option>
                    {[...participants]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                </select>
            </div>

            {summary && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-around text-center mb-4">
                        <div>
                            <p className="text-xl font-bold text-gray-800">{summary.total}</p>
                            <p className="text-xs text-gray-500">총 전적</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-blue-600">{summary.wins}</p>
                            <p className="text-xs text-gray-500">승</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-red-500">{summary.losses}</p>
                            <p className="text-xs text-gray-500">패</p>
                        </div>
                    </div>
                    {summary.opponents.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">파트너를 많이 한 선수</p>
                            <ul className="flex flex-col gap-1">
                                {summary.opponents.slice(0, 5).map(({ player, count }) => (
                                    <li
                                        key={player.id}
                                        className="flex justify-between items-center text-sm px-2 py-1 bg-gray-50 rounded"
                                    >
                                        <span className="text-gray-800">{player.name}</span>
                                        <span className="text-gray-500">{count}경기</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-4">
                {filteredMatches.map((match) => {
                    const p1 = playerMap.get(match.player1id);
                    const p2 = playerMap.get(match.player2id);
                    const p3 = playerMap.get(match.player3id);
                    const p4 = playerMap.get(match.player4id);
                    const isWinner = (player: MatchResultPlayer | undefined) =>
                        !!player && (match.winner1id === player.id || match.winner2id === player.id);

                    return (
                        <div key={match.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-2">
                                <span>
                                    {match.endTime
                                        ? new Date(match.endTime).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "시간 미상"}{" "}
                                    종료
                                </span>
                                <span>게임 번호: {match.id}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {renderPlayer(p1, isWinner(p1))}
                                {renderPlayer(p2, isWinner(p2))}
                                {renderPlayer(p3, isWinner(p3))}
                                {renderPlayer(p4, isWinner(p4))}
                            </div>
                            {userId && (
                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleSaveToDiary(match.id)}
                                        disabled={savedMatchIds.has(match.id) || savingMatchId === match.id}
                                        className="text-xs font-semibold px-3 py-1.5 rounded transition-colors disabled:cursor-not-allowed bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        {savedMatchIds.has(match.id)
                                            ? "저장됨"
                                            : savingMatchId === match.id
                                              ? "저장 중..."
                                              : "내기록으로 저장"}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredMatches.length === 0 && (
                    <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">
                        {selectedPlayerId ? "선택한 선수의 경기 결과가 없습니다." : "해당 날짜에 진행된 경기가 없습니다."}
                    </div>
                )}
            </div>

            {summary && (
                <div className="mt-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                        오늘 한 번도 같이 경기하지 않은 선수
                    </p>
                    {summary.neverPlayedWith.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {summary.neverPlayedWith.map((player) => (
                                <span
                                    key={player.id}
                                    className="text-sm px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-gray-700"
                                >
                                    {player.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">오늘 참가한 모든 선수와 한 번씩 경기했습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
}
