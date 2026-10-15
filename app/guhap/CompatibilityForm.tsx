"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Radar } from "react-chartjs-2";
import { Chart, registerables, type Plugin } from "chart.js";
import {
    deleteCompatibilityCheck,
    getCompatibility,
    getCompatibilityHistory,
    updateCompatibilityMemo,
} from "@/lib/compatibility";
import { getMyDiaryPlayerOptions, linkDiaryPlayerToUser } from "@/lib/getClubDiary";

Chart.register(...registerables);

type CompatibilityResult = Awaited<ReturnType<typeof getCompatibility>>;
type CompatibilityHistoryItem = Awaited<ReturnType<typeof getCompatibilityHistory>>[number];

function scoreLabel(score: number): string {
    if (score >= 90) return "환상의 복식 파트너! 🏆";
    if (score >= 75) return "손발 잘 맞는 좋은 궁합 👍";
    if (score >= 60) return "그럭저럭 괜찮은 조합 🙂";
    return "스타일 차이는 있지만 해볼만해요 🤔";
}

type SuccessResult = Extract<CompatibilityResult, { success: true }>;

function ScoreCard({ title, score, children }: { title: string; score: number; children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex justify-between items-center gap-2 p-4 text-left hover:bg-gray-50"
            >
                <span className="text-sm font-semibold text-gray-700">{title}</span>
                <span className="flex items-center gap-2 shrink-0">
                    <span className="text-lg font-bold text-blue-600">{score}점</span>
                    <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
                </span>
            </button>
            {expanded && <div className="px-4 pb-4">{children}</div>}
        </div>
    );
}

/** 육각형 차트의 각 꼭짓점 위에 점수를 항상 표시하는 플러그인 (호버 없이도 보이도록). */
const radarValueLabels: Plugin<"radar"> = {
    id: "radarValueLabels",
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((element, index) => {
                const value = dataset.data[index];
                if (value === null || value === undefined) return;
                const pos = element.tooltipPosition(true);
                ctx.save();
                ctx.fillStyle = "#1d4ed8";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillText(String(value), pos.x ?? 0, (pos.y ?? 0) - 6);
                ctx.restore();
            });
        });
    },
};

function HexagonChart({ detail }: { detail: SuccessResult }) {
    const labels = ["MBTI", "사주", "별자리", "소통", "스타일", "전적"];
    const data = [
        detail.mbti?.score ?? 0,
        detail.saju?.score ?? 0,
        detail.zodiac?.score ?? 0,
        detail.comm?.score ?? 0,
        detail.play?.score ?? 0,
        detail.record?.score ?? 0,
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
            <Radar
                data={{
                    labels,
                    datasets: [
                        {
                            label: "궁합 점수",
                            data,
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            borderColor: "rgba(59, 130, 246, 1)",
                            pointBackgroundColor: "rgba(59, 130, 246, 1)",
                        },
                    ],
                }}
                options={{
                    scales: { r: { beginAtZero: true, max: 100, ticks: { display: false, stepSize: 20 } } },
                    plugins: { legend: { display: false } },
                }}
                plugins={[radarValueLabels]}
            />
        </div>
    );
}

function DiaryRecordCard({
    userId,
    detail,
    onRelink,
}: {
    userId: number;
    detail: SuccessResult;
    onRelink: () => void | Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [options, setOptions] = useState<{ id: number; name: string; linkedUserId: number | null }[] | null>(null);
    const [selectedId, setSelectedId] = useState<number | "">("");
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const startEditing = async () => {
        setEditing(true);
        setError("");
        if (options) return;
        setIsLoadingOptions(true);
        try {
            const list = await getMyDiaryPlayerOptions(userId);
            setOptions(list);
            const current = list.find((p) => p.linkedUserId === detail.partnerUserId);
            setSelectedId(current ? current.id : "");
        } catch (err) {
            console.error("일지 선수 목록을 불러오는 중 오류가 발생했습니다:", err);
            setError("일지 선수 목록을 불러오지 못했어요.");
        } finally {
            setIsLoadingOptions(false);
        }
    };

    const handleApply = async () => {
        if (!selectedId) return;
        setIsSaving(true);
        setError("");
        try {
            const res = await linkDiaryPlayerToUser(userId, Number(selectedId), detail.partnerUserId);
            if ("error" in res) {
                setError(res.error);
                return;
            }
            setEditing(false);
            setOptions(null);
            await onRelink();
        } catch (err) {
            console.error("일지에 적용하는 중 오류가 발생했습니다:", err);
            setError("적용하는 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-gray-700">전적 궁합</p>
                {detail.record?.score != null && <p className="text-lg font-bold text-blue-600">{detail.record.score}점</p>}
            </div>
            {detail.record ? (
                <p className="text-sm text-gray-600 mb-2">
                    일지의 <b>{detail.record.linkedPlayerName}</b>님과 {detail.record.games}전 {detail.record.wins}승{" "}
                    {detail.record.losses}패
                </p>
            ) : (
                <p className="text-sm text-gray-400 mb-2">아직 일지 선수와 연동되지 않았어요.</p>
            )}

            {!editing ? (
                <button type="button" onClick={startEditing} className="text-xs text-blue-500 hover:underline font-semibold">
                    일지에 적용하기
                </button>
            ) : (
                <div className="flex flex-col gap-2 mt-2">
                    {isLoadingOptions ? (
                        <p className="text-xs text-gray-400">불러오는 중...</p>
                    ) : (
                        <select
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : "")}
                            className="text-sm p-2 border border-gray-200 rounded bg-white"
                        >
                            <option value="">선수를 선택하세요</option>
                            {options?.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    )}
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            disabled={isSaving}
                            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={!selectedId || isSaving}
                            className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            {isSaving ? "적용 중..." : "적용"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function CompatibilityBreakdown({
    userId,
    detail,
    onRelink,
}: {
    userId: number;
    detail: SuccessResult;
    onRelink: () => void | Promise<void>;
}) {
    return (
        <>
            <HexagonChart detail={detail} />
            <DiaryRecordCard userId={userId} detail={detail} onRelink={onRelink} />

            {detail.mbti && (
                <ScoreCard title={`MBTI 궁합 (${detail.mbti.myType} x ${detail.mbti.partnerType})`} score={detail.mbti.score}>
                    <p className="text-xs text-indigo-600 font-semibold mb-3">{detail.mbti.summary}</p>
                    <div className="flex flex-col gap-2">
                        {detail.mbti.layers.map((layer) => (
                            <div key={layer.title} className="bg-gray-50 rounded p-2">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-xs font-semibold text-gray-700">
                                        {layer.title} <span className="text-gray-400">· {layer.tag}</span>
                                    </p>
                                    <p className="text-xs font-bold text-blue-600">{layer.score}점</p>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{layer.description}</p>
                            </div>
                        ))}
                    </div>
                </ScoreCard>
            )}

            {detail.saju && (
                <ScoreCard
                    title={`민턴사주 궁합 (${detail.saju.myElement} x ${detail.saju.partnerElement})`}
                    score={detail.saju.score}
                >
                    <p className="text-xs text-indigo-600 font-semibold mb-3">{detail.saju.summary}</p>
                    <div className="flex flex-col gap-2">
                        {detail.saju.layers.map((layer) => (
                            <div key={layer.title} className="bg-gray-50 rounded p-2">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-xs font-semibold text-gray-700">
                                        {layer.title} <span className="text-gray-400">· {layer.tag}</span>
                                    </p>
                                    <p className="text-xs font-bold text-blue-600">{layer.score}점</p>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{layer.description}</p>
                            </div>
                        ))}
                    </div>
                </ScoreCard>
            )}

            {detail.zodiac && (
                <ScoreCard
                    title={`별자리 궁합 (${detail.zodiac.myZodiac} x ${detail.zodiac.partnerZodiac}, ${detail.zodiac.tag})`}
                    score={detail.zodiac.score}
                >
                    <p className="text-sm text-gray-600 leading-relaxed">{detail.zodiac.description}</p>
                </ScoreCard>
            )}

            {detail.comm && (
                <ScoreCard title="소통·멘탈 궁합" score={detail.comm.score}>
                    <p className="text-xs text-indigo-600 font-semibold mb-3">{detail.comm.summary}</p>
                    <div className="flex flex-col gap-2">
                        {detail.comm.layers.map((layer) => (
                            <div key={layer.title} className="bg-gray-50 rounded p-2">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-xs font-semibold text-gray-700">
                                        {layer.title} <span className="text-gray-400">· {layer.tag}</span>
                                    </p>
                                    <p className="text-xs font-bold text-blue-600">{layer.score}점</p>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{layer.description}</p>
                            </div>
                        ))}
                    </div>
                </ScoreCard>
            )}

            {detail.play && (
                <ScoreCard title="플레이 스타일 궁합" score={detail.play.score}>
                    <p className="text-xs text-indigo-600 font-semibold mb-3">{detail.play.summary}</p>
                    <div className="flex flex-col gap-2">
                        {detail.play.layers.map((layer) => (
                            <div key={layer.title} className="bg-gray-50 rounded p-2">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-xs font-semibold text-gray-700">
                                        {layer.title} <span className="text-gray-400">· {layer.tag}</span>
                                    </p>
                                    <p className="text-xs font-bold text-blue-600">{layer.score}점</p>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{layer.description}</p>
                            </div>
                        ))}
                    </div>
                </ScoreCard>
            )}

            {(!detail.mbti || !detail.saju || !detail.zodiac || !detail.comm || !detail.play) &&
                (detail.mbti || detail.saju || detail.zodiac || detail.comm || detail.play) && (
                    <p className="text-xs text-gray-400 text-center">
                        {[
                            !detail.mbti && "MBTI",
                            !detail.saju && "민턴사주",
                            !detail.zodiac && "별자리",
                            !(detail.comm || detail.play) && "민턴스타일",
                        ]
                            .filter(Boolean)
                            .join(", ")}{" "}
                        정보가 없는 쪽이 있어 측정된 지표만 반영됐어요.
                    </p>
                )}
        </>
    );
}

export default function CompatibilityForm({
    userId,
    hasMbti,
    hasSaju,
    hasStyle,
    initialPartnerUserName,
    initialHistory,
}: {
    userId: number;
    hasMbti: boolean;
    hasSaju: boolean;
    hasStyle: boolean;
    initialPartnerUserName?: string;
    initialHistory: CompatibilityHistoryItem[];
}) {
    const [partnerUserName, setPartnerUserName] = useState(initialPartnerUserName ?? "");
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState(initialHistory);
    const [memoDrafts, setMemoDrafts] = useState<Record<number, string>>(
        Object.fromEntries(initialHistory.map((item) => [item.id, item.memo])),
    );
    const [savingId, setSavingId] = useState<number | null>(null);
    const [savedId, setSavedId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [detailCache, setDetailCache] = useState<Record<number, CompatibilityResult>>({});
    const [detailLoadingId, setDetailLoadingId] = useState<number | null>(null);

    const handleSubmit = async (nameOverride?: string) => {
        const name = (nameOverride ?? partnerUserName).trim();
        if (!name || isLoading) return;
        setIsLoading(true);
        setResult(null);
        try {
            const res = await getCompatibility(userId, name);
            setResult(res);
            if (res && "success" in res && res.success) {
                const refreshed = await getCompatibilityHistory(userId);
                setHistory(refreshed);
                setMemoDrafts(Object.fromEntries(refreshed.map((item) => [item.id, item.memo])));
            }
        } catch (error) {
            console.error("궁합을 계산하는 중 오류가 발생했습니다:", error);
            setResult({ error: "궁합을 계산하는 중 오류가 발생했습니다." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMemoSave = async (checkId: number) => {
        setSavingId(checkId);
        setSavedId(null);
        try {
            const memo = memoDrafts[checkId] ?? "";
            const res = await updateCompatibilityMemo(userId, checkId, memo);
            if (res && "success" in res) {
                setHistory((prev) => prev.map((item) => (item.id === checkId ? { ...item, memo } : item)));
                setSavedId(checkId);
            }
        } catch (error) {
            console.error("메모를 저장하는 중 오류가 발생했습니다:", error);
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (checkId: number) => {
        if (!confirm("이 궁합 기록을 삭제할까요?")) return;
        try {
            const res = await deleteCompatibilityCheck(userId, checkId);
            if (res && "success" in res) {
                setHistory((prev) => prev.filter((item) => item.id !== checkId));
                setMemoDrafts((prev) => {
                    const next = { ...prev };
                    delete next[checkId];
                    return next;
                });
                setDetailCache((prev) => {
                    const next = { ...prev };
                    delete next[checkId];
                    return next;
                });
                if (expandedId === checkId) setExpandedId(null);
            }
        } catch (error) {
            console.error("궁합 기록을 삭제하는 중 오류가 발생했습니다:", error);
        }
    };

    const refreshDetail = async (item: CompatibilityHistoryItem) => {
        setDetailLoadingId(item.id);
        try {
            const res = await getCompatibility(userId, item.partnerUserName);
            setDetailCache((prev) => ({ ...prev, [item.id]: res }));
            const refreshedHistory = await getCompatibilityHistory(userId);
            setHistory(refreshedHistory);
        } catch (error) {
            console.error("궁합을 불러오는 중 오류가 발생했습니다:", error);
            setDetailCache((prev) => ({ ...prev, [item.id]: { error: "궁합을 불러오는 중 오류가 발생했습니다." } }));
        } finally {
            setDetailLoadingId(null);
        }
    };

    const toggleDetail = async (item: CompatibilityHistoryItem) => {
        if (expandedId === item.id) {
            setExpandedId(null);
            return;
        }
        setExpandedId(item.id);
        if (detailCache[item.id]) return;
        await refreshDetail(item);
    };

    // QR코드로 들어온 경우 상대방 아이디가 미리 채워져 있으므로 바로 궁합을 계산합니다.
    useEffect(() => {
        if (initialPartnerUserName?.trim()) {
            handleSubmit(initialPartnerUserName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-1">민턴궁합</h1>
            <p className="text-center text-gray-500 mb-6">
                상대방 아이디를 입력하면 MBTI와 민턴사주로 복식 궁합을 봐드려요
            </p>

            {!hasMbti && !hasSaju && !hasStyle && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-700">
                    아직 MBTI와 민턴사주를 측정하지 않으셨네요. 먼저{" "}
                    <Link href="/mbti" className="underline font-semibold">
                        MBTI
                    </Link>
                    ,{" "}
                    <Link href="/saju" className="underline font-semibold">
                        민턴사주
                    </Link>
                    , 또는{" "}
                    <Link href="/style" className="underline font-semibold">
                        민턴스타일
                    </Link>
                    을 측정하면 더 정확한 궁합을 볼 수 있어요.
                </div>
            )}

            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={partnerUserName}
                    onChange={(e) => setPartnerUserName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder="상대방 아이디"
                    className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={() => handleSubmit()}
                    disabled={isLoading || !partnerUserName.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isLoading ? "계산 중..." : "궁합 보기"}
                </button>
            </div>

            <button
                onClick={() => handleSubmit("dogtable")}
                disabled={isLoading}
                className="block w-full text-center mb-8 text-sm text-indigo-500 hover:text-indigo-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
                주인장과의 궁합이 궁금하세요?
            </button>

            {result && "error" in result && (
                <p className="text-red-500 text-sm text-center bg-red-50 rounded py-3 px-2">{result.error}</p>
            )}

            {result && "success" in result && result.success && (
                <div className="flex flex-col gap-4">
                    <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-6">
                        <p className="text-gray-600 mb-1">
                            나와 <b>{result.partnerName}</b>님의 궁합은
                        </p>
                        <p className="text-5xl font-extrabold text-blue-600 mb-2">{result.overallScore}점</p>
                        <p className="text-gray-700 font-semibold">{scoreLabel(result.overallScore)}</p>
                    </div>

                    <CompatibilityBreakdown
                        key={result.partnerName}
                        userId={userId}
                        detail={result}
                        onRelink={() => handleSubmit(result.partnerUserName)}
                    />
                </div>
            )}

            {history.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-bold mb-3">지금까지 본 궁합</h2>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-200 bg-gray-50">
                                    <th className="text-left font-medium py-2 pl-3 pr-2">상대</th>
                                    <th className="font-medium py-2 px-1">총점</th>
                                    <th className="font-medium py-2 px-1">메모</th>
                                    <th className="font-medium py-2 pr-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => {
                                    const detail = detailCache[item.id];
                                    const isExpanded = expandedId === item.id;
                                    return (
                                        <Fragment key={item.id}>
                                            <tr
                                                onClick={() => toggleDetail(item)}
                                                className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 last:border-b-0"
                                            >
                                                <td className="py-2 pl-3 pr-2 font-semibold text-gray-800 max-w-24 truncate">
                                                    {item.partnerName}
                                                </td>
                                                <td className="py-2 px-1 text-center font-bold text-blue-600">
                                                    {item.overallScore}
                                                </td>
                                                <td className="py-2 px-1">
                                                    <div className="flex flex-col items-center gap-0.5">
                                                        <input
                                                            type="text"
                                                            value={memoDrafts[item.id] ?? ""}
                                                            onChange={(e) =>
                                                                setMemoDrafts((prev) => ({
                                                                    ...prev,
                                                                    [item.id]: e.target.value.slice(0, 10),
                                                                }))
                                                            }
                                                            onBlur={() => handleMemoSave(item.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            placeholder="메모"
                                                            maxLength={10}
                                                            className="w-20 text-xs p-1 border border-gray-200 rounded text-center"
                                                        />
                                                        {savingId === item.id && (
                                                            <span className="text-[10px] text-gray-400">저장중</span>
                                                        )}
                                                        {savedId === item.id && savingId !== item.id && (
                                                            <span className="text-[10px] text-green-600">저장됨</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2 pr-2 text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(item.id);
                                                        }}
                                                        aria-label="삭제"
                                                        className="text-gray-300 hover:text-red-500 px-1"
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={4} className="bg-gray-50 border-b border-gray-100 p-3">
                                                        <div className="flex flex-col gap-3">
                                                            {detailLoadingId === item.id && (
                                                                <p className="text-xs text-gray-400 text-center py-2">
                                                                    불러오는 중...
                                                                </p>
                                                            )}
                                                            {detail && "error" in detail && (
                                                                <p className="text-xs text-red-500 text-center">
                                                                    {detail.error}
                                                                </p>
                                                            )}
                                                            {detail && "success" in detail && detail.success && (
                                                                <CompatibilityBreakdown
                                                                    userId={userId}
                                                                    detail={detail}
                                                                    onRelink={() => refreshDetail(item)}
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Link href="/indexPage" className="block text-center mt-8 text-gray-500 hover:text-gray-700 text-sm">
                돌아가기
            </Link>
        </div>
    );
}
