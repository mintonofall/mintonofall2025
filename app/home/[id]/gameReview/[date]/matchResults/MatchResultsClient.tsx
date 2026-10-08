"use client";

import { useState } from "react";

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
    players,
    matches,
    initialPlayerId = null,
}: {
    players: MatchResultPlayer[];
    matches: MatchResult[];
    initialPlayerId?: number | null;
}) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(initialPlayerId);

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
        const opponentCounts = new Map<number, number>();

        filteredMatches.forEach((match) => {
            const matchPlayers = [match.player1id, match.player2id, match.player3id, match.player4id];
            if (match.winner1id === selectedPlayerId || match.winner2id === selectedPlayerId) {
                wins += 1;
            } else if (match.winner1id != null) {
                losses += 1;
            }
            matchPlayers.forEach((pid) => {
                if (pid && pid !== selectedPlayerId) {
                    opponentCounts.set(pid, (opponentCounts.get(pid) || 0) + 1);
                }
            });
        });

        const opponents = Array.from(opponentCounts.entries())
            .map(([pid, count]) => ({ player: playerMap.get(pid), count }))
            .filter((entry): entry is { player: MatchResultPlayer; count: number } => !!entry.player)
            .sort((a, b) => b.count - a.count);

        // 오늘 경기에 참가했지만 선택한 선수와는 한 번도 같은 경기를 뛰지 않은 선수
        const neverPlayedWith = participants
            .filter((p) => p.id !== selectedPlayerId && !opponentCounts.has(p.id))
            .sort((a, b) => a.name.localeCompare(b.name));

        summary = { total: filteredMatches.length, wins, losses, opponents, neverPlayedWith };
    }

    return (
        <div className="w-full max-w-2xl">
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
                            <p className="text-sm font-semibold text-gray-700 mb-2">많이 함께한 선수</p>
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
