"use client";

import { useState } from "react";
import Link from "next/link";
import { Radar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ELEMENT_STYLE, type Element, type SajuResult } from "@/lib/sajuTypes";
import { ZODIAC_STYLE } from "@/lib/zodiac";
import { calculateAndSaveSaju } from "@/lib/saju";

Chart.register(...registerables);

const ELEMENT_COLOR: Record<Element, string> = {
    목: "bg-green-100 text-green-800 border-green-300",
    화: "bg-red-100 text-red-800 border-red-300",
    토: "bg-amber-100 text-amber-800 border-amber-300",
    금: "bg-gray-100 text-gray-800 border-gray-300",
    수: "bg-blue-100 text-blue-800 border-blue-300",
};

const ELEMENT_ORDER: Element[] = ["목", "화", "토", "금", "수"];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1939 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function PillarCard({ title, gan, zhi }: { title: string; gan?: { hangul: string; hanja: string; element: Element }; zhi?: { hangul: string; hanja: string; element: Element } }) {
    if (!gan || !zhi) {
        return (
            <div className="border border-gray-200 rounded-lg p-3 text-center text-gray-300 bg-gray-50">
                <p className="text-xs mb-1">{title}</p>
                <p className="text-sm">모름</p>
            </div>
        );
    }
    return (
        <div className="border rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">{title}</p>
            <div className={`rounded px-2 py-1 mb-1 border ${ELEMENT_COLOR[gan.element]}`}>
                <p className="font-bold">{gan.hangul}</p>
                <p className="text-[10px]">{gan.hanja}</p>
            </div>
            <div className={`rounded px-2 py-1 border ${ELEMENT_COLOR[zhi.element]}`}>
                <p className="font-bold">{zhi.hangul}</p>
                <p className="text-[10px]">{zhi.hanja}</p>
            </div>
        </div>
    );
}

export default function SajuForm({
    userId,
    userName,
    initialResult,
}: {
    userId: number;
    userName: string;
    initialResult: SajuResult | null;
}) {
    const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
    const [year, setYear] = useState(1995);
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);
    const [isLeapMonth, setIsLeapMonth] = useState(false);
    const [hourUnknown, setHourUnknown] = useState(true);
    const [hour, setHour] = useState(12);
    const [result, setResult] = useState<SajuResult | null>(initialResult);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(!initialResult);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const saved = await calculateAndSaveSaju(userId, {
                calendarType,
                year,
                month,
                day,
                isLeapMonth: calendarType === "lunar" ? isLeapMonth : undefined,
                hour: hourUnknown ? null : hour,
            });
            setResult(saved);
            setShowForm(false);
        } catch (error) {
            console.error("사주 계산 중 오류가 발생했습니다:", error);
            alert("생년월일을 다시 확인해주세요. (존재하지 않는 날짜일 수 있어요)");
        } finally {
            setIsSaving(false);
        }
    };

    if (!showForm && result) {
        return (
            <div className="max-w-xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-center mb-1">민턴사주</h1>
                <p className="text-center text-gray-500 mb-6">{userName}님의 타고난 배드민턴 성향</p>

                <div className="grid grid-cols-4 gap-2 mb-6">
                    <PillarCard
                        title="년주"
                        gan={{ hangul: result.pillars.year.ganHangul, hanja: result.pillars.year.ganHanja, element: result.pillars.year.ganElement }}
                        zhi={{ hangul: result.pillars.year.zhiHangul, hanja: result.pillars.year.zhiHanja, element: result.pillars.year.zhiElement }}
                    />
                    <PillarCard
                        title="월주"
                        gan={{ hangul: result.pillars.month.ganHangul, hanja: result.pillars.month.ganHanja, element: result.pillars.month.ganElement }}
                        zhi={{ hangul: result.pillars.month.zhiHangul, hanja: result.pillars.month.zhiHanja, element: result.pillars.month.zhiElement }}
                    />
                    <PillarCard
                        title="일주"
                        gan={{ hangul: result.pillars.day.ganHangul, hanja: result.pillars.day.ganHanja, element: result.pillars.day.ganElement }}
                        zhi={{ hangul: result.pillars.day.zhiHangul, hanja: result.pillars.day.zhiHanja, element: result.pillars.day.zhiElement }}
                    />
                    <PillarCard
                        title="시주"
                        gan={
                            result.pillars.time
                                ? { hangul: result.pillars.time.ganHangul, hanja: result.pillars.time.ganHanja, element: result.pillars.time.ganElement }
                                : undefined
                        }
                        zhi={
                            result.pillars.time
                                ? { hangul: result.pillars.time.zhiHangul, hanja: result.pillars.time.zhiHanja, element: result.pillars.time.zhiElement }
                                : undefined
                        }
                    />
                </div>

                {result.zodiac && ZODIAC_STYLE[result.zodiac] ? (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-4 mb-6 flex items-center gap-4">
                        <div className="text-5xl shrink-0">{ZODIAC_STYLE[result.zodiac].emoji}</div>
                        <div>
                            <p className="text-sm text-gray-500">
                                별자리 <span className="text-indigo-600">{ZODIAC_STYLE[result.zodiac].symbol}</span>{" "}
                                {result.zodiac}
                            </p>
                            <p className="font-bold text-gray-800">{ZODIAC_STYLE[result.zodiac].style}</p>
                            <p className="text-sm text-gray-600">{ZODIAC_STYLE[result.zodiac].description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-700 text-center">
                        별자리 정보가 없어요. 아래 &quot;다시 계산하기&quot;로 생년월일을 다시 입력하면 별자리도 함께 표시돼요.
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                    <Radar
                        data={{
                            labels: ELEMENT_ORDER.map((e) => `${ELEMENT_STYLE[e].name} ${ELEMENT_STYLE[e].style}`),
                            datasets: [
                                {
                                    label: "오행 분포",
                                    data: ELEMENT_ORDER.map((e) => result.elementCounts[e]),
                                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                                    borderColor: "rgba(59, 130, 246, 1)",
                                    pointBackgroundColor: "rgba(59, 130, 246, 1)",
                                },
                            ],
                        }}
                        options={{
                            scales: { r: { beginAtZero: true, ticks: { stepSize: 1 } } },
                            plugins: { legend: { display: false } },
                        }}
                    />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                    <p className="text-sm font-semibold text-blue-700 mb-2">분석 결과</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.analysis}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300"
                    >
                        다시 계산하기
                    </button>
                    <Link
                        href="/indexPage"
                        className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 text-center"
                    >
                        홈으로
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-1">민턴사주</h1>
            <p className="text-center text-gray-500 mb-8">생년월일로 타고난 배드민턴 성향을 알아보세요</p>

            <div className="flex flex-col gap-4">
                <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-1">음력 / 양력</span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-sm">
                            <input
                                type="radio"
                                checked={calendarType === "solar"}
                                onChange={() => setCalendarType("solar")}
                            />
                            양력
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                            <input
                                type="radio"
                                checked={calendarType === "lunar"}
                                onChange={() => setCalendarType("lunar")}
                            />
                            음력
                        </label>
                    </div>
                </div>

                <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-1">생년월일</span>
                    <div className="flex gap-2">
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white"
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>
                                    {y}년
                                </option>
                            ))}
                        </select>
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white"
                        >
                            {MONTHS.map((m) => (
                                <option key={m} value={m}>
                                    {m}월
                                </option>
                            ))}
                        </select>
                        <select
                            value={day}
                            onChange={(e) => setDay(Number(e.target.value))}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white"
                        >
                            {DAYS.map((d) => (
                                <option key={d} value={d}>
                                    {d}일
                                </option>
                            ))}
                        </select>
                    </div>
                    {calendarType === "lunar" && (
                        <label className="flex items-center gap-1 text-sm mt-2 text-gray-600">
                            <input
                                type="checkbox"
                                checked={isLeapMonth}
                                onChange={(e) => setIsLeapMonth(e.target.checked)}
                            />
                            윤달이에요
                        </label>
                    )}
                </div>

                <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-1">태어난 시간 (선택)</span>
                    <label className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <input
                            type="checkbox"
                            checked={hourUnknown}
                            onChange={(e) => setHourUnknown(e.target.checked)}
                        />
                        시간을 모르거나 입력하지 않을게요
                    </label>
                    {!hourUnknown && (
                        <select
                            value={hour}
                            onChange={(e) => setHour(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        >
                            {HOURS.map((h) => (
                                <option key={h} value={h}>
                                    {h}시
                                </option>
                            ))}
                        </select>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                        시간을 알면 시주까지 반영해 더 정확하게 분석해요.
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="mt-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isSaving ? "분석 중..." : "민턴사주 보기"}
                </button>

                {result && (
                    <button
                        onClick={() => setShowForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        이전 결과 보기
                    </button>
                )}
            </div>
        </div>
    );
}
