"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getPlayersFromClub, getMatch } from "@/lib/getClubDiary";
import { PlayerDiary } from "@/lib/interface";
import type { MatchDiaryWithPlayers } from "@/lib/types";
import getSessionClient from "@/lib/sessionClient";
import { getKoreaTime } from "@/lib/getKoreaTime";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { Chart, registerables, Plugin } from "chart.js";
Chart.register(...registerables);

/** 도넛 차트 각 조각 위에 값을 항상 표시하는 플러그인 (호버 없이도 보이도록). */
const doughnutValueLabels: Plugin<"doughnut"> = {
    id: "doughnutValueLabels",
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((element, index) => {
                const value = dataset.data[index];
                if (value === null || value === undefined || Number(value) === 0) return;
                const pos = element.tooltipPosition(true);
                ctx.save();
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 14px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(value), pos.x ?? 0, pos.y ?? 0);
                ctx.restore();
            });
        });
    },
};

/** 막대 차트 각 막대 위에 값을 항상 표시하는 플러그인 (호버 없이도 보이도록). */
const barValueLabels: Plugin<"bar"> = {
    id: "barValueLabels",
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((element, index) => {
                const value = dataset.data[index];
                if (value === null || value === undefined) return;
                const pos = element.tooltipPosition(true);
                ctx.save();
                ctx.fillStyle = "#374151";
                ctx.font = "bold 14px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillText(String(value), pos.x ?? 0, (pos.y ?? 0) - 6);
                ctx.restore();
            });
        });
    },
};

type Preset = "all" | "year" | "month" | "last3months" | "week" | "last30" | "last90";
type Granularity = "month" | "week" | "day";

const PRESETS: { key: Preset; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "year", label: "올해" },
    { key: "month", label: "이번달" },
    { key: "last3months", label: "최근 3달" },
    { key: "week", label: "이번주" },
    { key: "last30", label: "최근 30일" },
    { key: "last90", label: "최근 90일" },
];

/** date의 UTC 필드가 한국 기준 날짜를 나타내도록 9시간을 더한 Date를 반환합니다. */
function toKst(date: Date): Date {
    return new Date(date.getTime() + 9 * 60 * 60000);
}

/** UTC 필드를 한국 기준 날짜로 간주하여 "YYYY-MM-DD" 문자열로 변환합니다. */
function formatDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function rangeStart(dateStr: string): Date {
    return new Date(`${dateStr}T00:00:00+09:00`);
}
function rangeEnd(dateStr: string): Date {
    return new Date(`${dateStr}T23:59:59.999+09:00`);
}

/** 해당 주(월요일 시작)의 월요일 날짜를 "YYYY-MM-DD"로 반환합니다. */
function mondayOf(kstDate: Date): Date {
    const dow = kstDate.getUTCDay(); // 0=일 .. 6=토
    const diffToMonday = dow === 0 ? 6 : dow - 1;
    const monday = new Date(kstDate);
    monday.setUTCDate(monday.getUTCDate() - diffToMonday);
    return monday;
}

export default function StatHome({ params }: { params: Promise<{ clubid: string }> }) {
    const [clubid, setClubid] = useState<string | null>(null);
    const [userid, setUserid] = useState(0);
    const [players, setPlayers] = useState<PlayerDiary[]>([]);
    const [matches, setMatches] = useState<MatchDiaryWithPlayers[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState<string>(() => {
        const t = getKoreaTime();
        return formatDate(new Date(Date.UTC(t.getUTCFullYear(), 0, 1)));
    });
    const [endDate, setEndDate] = useState<string>(() => formatDate(getKoreaTime()));
    const [activePreset, setActivePreset] = useState<Preset | null>("year");
    const [granularity, setGranularity] = useState<Granularity>("month");

    useEffect(() => {
        async function fetchParams() {
            const resolved = await params;
            setClubid(resolved.clubid);
            const session = await getSessionClient();
            setUserid(Number(session!.id));
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchData() {
            if (userid === 0) return;
            setIsLoading(true);
            const [playerData, matchData] = await Promise.all([getPlayersFromClub(userid), getMatch(userid)]);
            setPlayers(playerData);
            setMatches(matchData);
            setIsLoading(false);
        }
        fetchData();
    }, [userid]);

    const me = players.find((p) => p.isMe);

    function applyPreset(preset: Preset) {
        const now = getKoreaTime();
        const end = formatDate(now);
        let start: string;
        switch (preset) {
            case "all": {
                if (matches.length > 0) {
                    const earliest = matches.reduce(
                        (min, m) => (m.startTime < min ? m.startTime : min),
                        matches[0].startTime,
                    );
                    start = formatDate(toKst(earliest));
                } else {
                    start = "2000-01-01";
                }
                break;
            }
            case "year":
                start = formatDate(new Date(Date.UTC(now.getUTCFullYear(), 0, 1)));
                break;
            case "month":
                start = formatDate(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)));
                break;
            case "last3months": {
                const d = new Date(now);
                d.setUTCMonth(d.getUTCMonth() - 3);
                start = formatDate(d);
                break;
            }
            case "week":
                start = formatDate(mondayOf(now));
                break;
            case "last30": {
                const d = new Date(now);
                d.setUTCDate(d.getUTCDate() - 29);
                start = formatDate(d);
                break;
            }
            case "last90": {
                const d = new Date(now);
                d.setUTCDate(d.getUTCDate() - 89);
                start = formatDate(d);
                break;
            }
        }
        setStartDate(start);
        setEndDate(end);
        setActivePreset(preset);
    }

    const filteredMatches = useMemo(() => {
        if (!me || !startDate || !endDate) return [];
        const start = rangeStart(startDate);
        const end = rangeEnd(endDate);
        return matches.filter((m) => {
            if (!m.startTime) return false;
            const t = new Date(m.startTime);
            if (t < start || t > end) return false;
            return m.players.some((p) => p.id === me.id);
        });
    }, [matches, me, startDate, endDate]);

    const summary = useMemo(() => {
        let wins = 0;
        let losses = 0;
        let scoreFor = 0;
        let scoreAgainst = 0;
        if (!me) return { wins, losses, scoreFor, scoreAgainst };

        filteredMatches.forEach((m) => {
            const team1Ids = [m.players[0]?.id, m.players[1]?.id];
            const isTeam1 = team1Ids.includes(me.id);

            if (m.score1 != null && m.score2 != null) {
                scoreFor += isTeam1 ? m.score1 : m.score2;
                scoreAgainst += isTeam1 ? m.score2 : m.score1;
            }
            if (m.winner1id === me.id || m.winner2id === me.id) {
                wins += 1;
            } else if (m.winner1id != null) {
                losses += 1;
            }
        });
        return { wins, losses, scoreFor, scoreAgainst };
    }, [filteredMatches, me]);

    const rankings = useMemo(() => {
        type RankEntry = { player: PlayerDiary; wins: number; losses: number; total: number };
        if (!me)
            return {
                beatenMost: [] as RankEntry[],
                lostToMost: [] as RankEntry[],
                mostFaced: [] as RankEntry[],
                partnersMost: [] as RankEntry[],
            };

        // 상대전적: 나와 서로 다른 팀으로 맞붙은 모든 경기를 집계합니다 (승/패는 결과가 난 경기만 반영).
        const opponentRecords = new Map<number, { wins: number; losses: number; total: number }>();
        // 파트너전적: 나와 같은 팀으로 함께한 모든 경기를 집계합니다 (미정 경기도 전적수에는 포함).
        const partnerRecords = new Map<number, { wins: number; losses: number; total: number }>();

        filteredMatches.forEach((m) => {
            const team1 = m.players.slice(0, 2);
            const team2 = m.players.slice(2, 4);
            const meInTeam1 = team1.some((p) => p.id === me.id);
            const meTeam = meInTeam1 ? team1 : team2;
            const oppTeam = meInTeam1 ? team2 : team1;
            const decided = m.winner1id != null;
            const meWon = decided && (m.winner1id === me.id || m.winner2id === me.id);

            meTeam.forEach((p) => {
                if (p.id === me.id) return;
                const rec = partnerRecords.get(p.id) || { wins: 0, losses: 0, total: 0 };
                rec.total += 1;
                if (decided) {
                    if (meWon) rec.wins += 1;
                    else rec.losses += 1;
                }
                partnerRecords.set(p.id, rec);
            });

            oppTeam.forEach((p) => {
                const rec = opponentRecords.get(p.id) || { wins: 0, losses: 0, total: 0 };
                rec.total += 1;
                if (decided) {
                    if (meWon) rec.wins += 1;
                    else rec.losses += 1;
                }
                opponentRecords.set(p.id, rec);
            });
        });

        const toRanked = (
            map: Map<number, { wins: number; losses: number; total: number }>,
            sortBy: "wins" | "losses" | "total",
        ): RankEntry[] =>
            Array.from(map.entries())
                .map(([id, rec]) => {
                    const player = players.find((p) => p.id === id);
                    if (!player) return null;
                    return { player, wins: rec.wins, losses: rec.losses, total: rec.total };
                })
                .filter((e): e is RankEntry => !!e)
                .sort((a, b) => b[sortBy] - a[sortBy])
                .slice(0, 10);

        return {
            beatenMost: toRanked(opponentRecords, "wins"),
            lostToMost: toRanked(opponentRecords, "losses"),
            mostFaced: toRanked(opponentRecords, "total"),
            partnersMost: toRanked(partnerRecords, "total"),
        };
    }, [filteredMatches, me, players]);

    const trend = useMemo(() => {
        if (!me) return { labels: [] as string[], counts: [] as number[] };
        const buckets = new Map<string, { label: string; count: number }>();

        filteredMatches.forEach((m) => {
            const won = m.winner1id === me.id || m.winner2id === me.id;
            if (!won) return;
            const kst = toKst(m.startTime);
            let sortKey: string;
            let label: string;
            if (granularity === "month") {
                sortKey = `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, "0")}`;
                label = `${kst.getUTCFullYear()}.${String(kst.getUTCMonth() + 1).padStart(2, "0")}`;
            } else if (granularity === "day") {
                sortKey = formatDate(kst);
                label = `${String(kst.getUTCMonth() + 1).padStart(2, "0")}/${String(kst.getUTCDate()).padStart(2, "0")}`;
            } else {
                const monday = mondayOf(kst);
                sortKey = formatDate(monday);
                label = `${String(monday.getUTCMonth() + 1).padStart(2, "0")}/${String(monday.getUTCDate()).padStart(2, "0")}주`;
            }
            const existing = buckets.get(sortKey);
            buckets.set(sortKey, { label, count: (existing?.count || 0) + 1 });
        });

        const sortedKeys = Array.from(buckets.keys()).sort();
        return {
            labels: sortedKeys.map((k) => buckets.get(k)!.label),
            counts: sortedKeys.map((k) => buckets.get(k)!.count),
        };
    }, [filteredMatches, me, granularity]);

    const renderRankList = (
        title: string,
        entries: { player: PlayerDiary; wins: number; losses: number; total: number }[],
    ) => (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>
            {entries.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">데이터가 없습니다.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {entries.map((entry, index) => (
                        <li key={entry.player.id} className="flex items-center justify-between text-sm gap-2">
                            <span className="text-gray-700 truncate">
                                <span className="text-gray-400 mr-1">{index + 1}.</span>
                                {entry.player.name}
                            </span>
                            <span className="font-semibold text-blue-600 shrink-0 whitespace-nowrap">
                                {entry.total}전 {entry.wins}승 {entry.losses}패
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    if (isLoading) {
        return <div className="text-center py-20 text-gray-500">불러오는 중...</div>;
    }

    if (!me) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p className="mb-4">"주인공"으로 지정된 선수가 없어 통계를 계산할 수 없습니다.</p>
                {clubid && (
                    <Link href={`/diary/${clubid}/players`} className="text-blue-500 hover:underline font-semibold">
                        선수 목록에서 주인공 지정하러 가기
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="pb-8">
            <h1 className="text-2xl font-bold text-center mb-4">{me.name}의 통계</h1>

            {/* 기간 설정 */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setActivePreset(null); // 직접 입력 시 프리셋 선택 해제
                        }}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                    <span className="text-gray-500">~</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setActivePreset(null);
                        }}
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.key}
                            onClick={() => applyPreset(preset.key)}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                                activePreset === preset.key
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 승/패/득점/실점 요약 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <p className="text-sm text-gray-500">승</p>
                    <p className="text-2xl font-bold text-blue-600">{summary.wins}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <p className="text-sm text-gray-500">패</p>
                    <p className="text-2xl font-bold text-red-500">{summary.losses}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <p className="text-sm text-gray-500">득점</p>
                    <p className="text-2xl font-bold text-green-600">{summary.scoreFor}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <p className="text-sm text-gray-500">실점</p>
                    <p className="text-2xl font-bold text-gray-500">{summary.scoreAgainst}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800 text-center">승/패 비율</h3>
                    {summary.wins + summary.losses > 0 ? (
                        <Doughnut
                            data={{
                                labels: ["승", "패"],
                                datasets: [
                                    {
                                        data: [summary.wins, summary.losses],
                                        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(239, 68, 68, 0.8)"],
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: { position: "bottom" },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.formattedValue}경기`,
                                        },
                                    },
                                },
                            }}
                            plugins={[doughnutValueLabels]}
                        />
                    ) : (
                        <p className="text-center text-gray-400 py-10">해당 기간에 경기 기록이 없습니다.</p>
                    )}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800 text-center">득점 vs 실점</h3>
                    <Bar
                        data={{
                            labels: ["득점", "실점"],
                            datasets: [
                                {
                                    data: [summary.scoreFor, summary.scoreAgainst],
                                    backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(148, 163, 184, 0.8)"],
                                    borderRadius: 6,
                                },
                            ],
                        }}
                        options={{
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true } },
                        }}
                        plugins={[barValueLabels]}
                    />
                </div>
            </div>

            {/* 트렌드 그래프 */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <h3 className="text-lg font-bold text-gray-800">승수 트렌드</h3>
                    <div className="flex gap-2">
                        {(
                            [
                                { key: "month", label: "월별" },
                                { key: "week", label: "주별" },
                                { key: "day", label: "일별" },
                            ] as { key: Granularity; label: string }[]
                        ).map((g) => (
                            <button
                                key={g.key}
                                onClick={() => setGranularity(g.key)}
                                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                    granularity === g.key
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>
                {trend.labels.length > 0 ? (
                    <Line
                        data={{
                            labels: trend.labels,
                            datasets: [
                                {
                                    label: "승수",
                                    data: trend.counts,
                                    borderColor: "rgba(59, 130, 246, 1)",
                                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                                    tension: 0.3,
                                    fill: true,
                                    pointRadius: 4,
                                },
                            ],
                        }}
                        options={{
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                        }}
                    />
                ) : (
                    <p className="text-center text-gray-400 py-10">해당 기간에 승리 기록이 없습니다.</p>
                )}
            </div>

            {/* 순위 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderRankList("내가 많이 이긴 선수", rankings.beatenMost)}
                {renderRankList("나를 많이 이긴 선수", rankings.lostToMost)}
                {renderRankList("나와 상대를 많이 한 선수", rankings.mostFaced)}
                {renderRankList("파트너를 많이 한 선수", rankings.partnersMost)}
            </div>
        </div>
    );
}
