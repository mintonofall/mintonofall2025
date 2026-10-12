"use client";

import { useState } from "react";
import { claimPlayerIdentity } from "./action";
import { MBTI_DESCRIPTIONS } from "@/lib/mbtiQuestions";

const MBTI_TYPES = Object.keys(MBTI_DESCRIPTIONS);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1939 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function ClaimMeModal({
    userId,
    playerId,
    clubId,
    playerName,
    initial,
    onClose,
    onSaved,
}: {
    userId: number;
    playerId: number;
    clubId: number;
    playerName: string;
    initial: {
        mbti: string | null;
        birthYear: number | null;
        birthMonth: number | null;
        birthDay: number | null;
        birthCalendarType: string | null;
        birthIsLeapMonth: boolean | null;
        birthHour: number | null;
    };
    onClose: () => void;
    onSaved: () => void;
}) {
    const [mbti, setMbti] = useState(initial.mbti ?? "");
    const [calendarType, setCalendarType] = useState<"solar" | "lunar">(
        initial.birthCalendarType === "lunar" ? "lunar" : "solar",
    );
    const [year, setYear] = useState(initial.birthYear ?? 1995);
    const [month, setMonth] = useState(initial.birthMonth ?? 1);
    const [day, setDay] = useState(initial.birthDay ?? 1);
    const [isLeapMonth, setIsLeapMonth] = useState(initial.birthIsLeapMonth ?? false);
    const [hourUnknown, setHourUnknown] = useState(initial.birthHour == null);
    const [hour, setHour] = useState(initial.birthHour ?? 12);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const result = await claimPlayerIdentity(userId, playerId, clubId, {
                mbti: mbti || null,
                birthYear: year,
                birthMonth: month,
                birthDay: day,
                calendarType,
                isLeapMonth: calendarType === "lunar" ? isLeapMonth : false,
                hour: hourUnknown ? null : hour,
            });
            if ("error" in result) {
                alert(result.error);
                return;
            }
            onSaved();
            onClose();
        } catch (error) {
            console.error("선수 정보를 저장하는 중 오류가 발생했습니다:", error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-1 text-center">{playerName} = 나</h2>
                <p className="text-xs text-gray-500 text-center mb-4">
                    MBTI와 생일을 입력하면 민턴사주도 함께 계산해서 저장해요.
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">MBTI (선택)</label>
                    <select
                        value={mbti}
                        onChange={(e) => setMbti(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">선택 안 함</option>
                        {MBTI_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
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

                <div className="mb-6">
                    <span className="block text-sm font-semibold text-gray-700 mb-1">태어난 시간 (선택)</span>
                    <label className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <input
                            type="checkbox"
                            checked={hourUnknown}
                            onChange={(e) => setHourUnknown(e.target.checked)}
                        />
                        모름
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
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded font-bold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>
        </div>
    );
}
