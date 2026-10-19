"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import { Chart, registerables, type Plugin } from "chart.js";
import { getGuestCompatibility } from "@/lib/guestCompat";
import { GUEST_PLAYER } from "@/lib/guestPlayer";
import { MBTI_DESCRIPTIONS } from "@/lib/mbtiQuestions";
import { ELEMENT_STYLE } from "@/lib/sajuTypes";
import { ZODIAC_STYLE } from "@/lib/zodiac";

Chart.register(...registerables);

type GuestResult = Awaited<ReturnType<typeof getGuestCompatibility>>;
type GuestSuccessResult = Extract<GuestResult, { success: true }>;

/** 막대 위에 점수를 항상 표시하는 플러그인 (호버 없이도 보이도록). */
const barValueLabels: Plugin<"bar"> = {
    id: "guestBarValueLabels",
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
                ctx.font = "bold 13px sans-serif";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(String(value), (pos.x ?? 0) + 8, pos.y ?? 0);
                ctx.restore();
            });
        });
    },
};

function LayerCard({ title, tag, score, description }: { title: string; tag: string; score: number; description: string }) {
    return (
        <div className="bg-gray-50 rounded p-3">
            <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-gray-700">
                    {title} <span className="text-gray-400">· {tag}</span>
                </p>
                <p className="text-xs font-bold text-indigo-600">{score}점</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function GuestResultBody({ result }: { result: GuestSuccessResult }) {
    const labels: string[] = [];
    const data: number[] = [];
    if (result.mbti) {
        labels.push("MBTI");
        data.push(result.mbti.score);
    }
    if (result.saju) {
        labels.push("사주");
        data.push(result.saju.score);
    }
    if (result.zodiac) {
        labels.push("별자리");
        data.push(result.zodiac.score);
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <Bar
                    data={{
                        labels,
                        datasets: [
                            {
                                label: "궁합 점수",
                                data,
                                backgroundColor: "rgba(99, 102, 241, 0.6)",
                                borderRadius: 6,
                            },
                        ],
                    }}
                    options={{
                        indexAxis: "y",
                        scales: { x: { beginAtZero: true, max: 100 } },
                        plugins: { legend: { display: false } },
                    }}
                    plugins={[barValueLabels]}
                />
            </div>

            {result.mbti && (
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                            MBTI 궁합 ({result.mbti.myType} x {result.mbti.guestType})
                        </p>
                        <p className="text-lg font-bold text-indigo-600">{result.mbti.score}점</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {GUEST_PLAYER.name} 선수는 {result.mbti.guestType}, {MBTI_DESCRIPTIONS[result.mbti.guestType]}{" "}
                        타입인데, 여러분과는 {result.mbti.summary}
                    </p>
                    <div className="flex flex-col gap-2">
                        {result.mbti.layers.map((layer) => (
                            <LayerCard
                                key={layer.title}
                                title={layer.title}
                                tag={layer.tag}
                                score={layer.score}
                                description={layer.description}
                            />
                        ))}
                    </div>
                </div>
            )}

            {result.saju && (
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                            사주 궁합 ({result.saju.myElement} x {result.saju.guestElement})
                        </p>
                        <p className="text-lg font-bold text-indigo-600">{result.saju.score}점</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {GUEST_PLAYER.name} 선수는 {ELEMENT_STYLE[result.saju.guestElement].name},{" "}
                        {ELEMENT_STYLE[result.saju.guestElement].description} 타입인데, 여러분과는 {result.saju.summary}
                    </p>
                    <div className="flex flex-col gap-2">
                        {result.saju.layers.map((layer) => (
                            <LayerCard
                                key={layer.title}
                                title={layer.title}
                                tag={layer.tag}
                                score={layer.score}
                                description={layer.description}
                            />
                        ))}
                    </div>
                </div>
            )}

            {result.zodiac && (
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                            별자리 궁합 ({result.zodiac.myZodiac} x {result.zodiac.guestZodiac}, {result.zodiac.tag})
                        </p>
                        <p className="text-lg font-bold text-indigo-600">{result.zodiac.score}점</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {GUEST_PLAYER.name} 선수는 {result.zodiac.guestZodiac}{" "}
                        {ZODIAC_STYLE[result.zodiac.guestZodiac].symbol}, {ZODIAC_STYLE[result.zodiac.guestZodiac].style}{" "}
                        타입인데, 여러분과는 {result.zodiac.description}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function GuestCompatibilityView({ userId }: { userId: number }) {
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<GuestResult | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await getGuestCompatibility(userId);
                setResult(res);
            } catch (error) {
                console.error("장수영 선수와의 궁합을 불러오는 중 오류가 발생했습니다:", error);
                setResult({ error: "궁합을 불러오는 중 오류가 발생했습니다." });
            } finally {
                setIsLoading(false);
            }
        })();
    }, [userId]);

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="flex flex-col items-center text-center mb-4">
                <img
                    src={GUEST_PLAYER.photo}
                    alt={GUEST_PLAYER.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow mb-2"
                />
                <h1 className="text-xl font-bold">특별게스트 {GUEST_PLAYER.name} 선수</h1>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{GUEST_PLAYER.bio}</p>
            </div>

            <p className="text-sm text-gray-700 bg-indigo-50 rounded-lg p-3 mb-6 leading-relaxed">
                {GUEST_PLAYER.name} 선수와 복식파트너를 한다니 너무 꿈같지 않은가요? 그럼 {GUEST_PLAYER.name} 선수와
                파트너를 한다면 뭘 준비해야 하고 뭘 조심해야할지 알아볼까요?
            </p>

            {isLoading && <p className="text-sm text-gray-400 text-center py-10">궁합을 보는 중...</p>}

            {result && "error" in result && (
                <p className="text-sm text-red-500 text-center bg-red-50 rounded py-3 px-2">{result.error}</p>
            )}

            {result && "success" in result && result.success && (
                <>
                    <GuestResultBody result={result} />
                    <p className="text-center text-sm text-indigo-500 font-semibold mt-6">
                        다음은 어떤 특별 게스트가 우릴 기다릴까요?
                    </p>
                </>
            )}

            <Link href="/guhap" className="block text-center mt-8 text-gray-500 hover:text-gray-700 text-sm">
                돌아가기
            </Link>
        </div>
    );
}
