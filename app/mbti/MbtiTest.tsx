"use client";

import { useState } from "react";
import Link from "next/link";
import {
    MBTI_QUESTIONS,
    MBTI_DESCRIPTIONS,
    calculateMbti,
    compareMbti,
    type MbtiQuestion,
} from "@/lib/mbtiQuestions";
import { saveMbtiResult } from "@/lib/mbti";

const QUESTIONS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(MBTI_QUESTIONS.length / QUESTIONS_PER_PAGE);
const MBTI_TYPES = Object.keys(MBTI_DESCRIPTIONS);

function shuffle<T>(list: T[]): T[] {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function MbtiTest({
    userId,
    userName,
    initialMbti,
}: {
    userId: number;
    userName: string;
    initialMbti: string | null;
}) {
    const [questions] = useState<MbtiQuestion[]>(() => shuffle(MBTI_QUESTIONS));
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [result, setResult] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [started, setStarted] = useState(false);
    const [selfReportedMbti, setSelfReportedMbti] = useState("");

    const pageQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
    const pageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);
    const isLastPage = page === TOTAL_PAGES - 1;

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = async () => {
        if (!pageAnswered) return;
        if (!isLastPage) {
            setPage((p) => p + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const { type } = calculateMbti(answers);
        setIsSaving(true);
        try {
            await saveMbtiResult(userId, type);
            setResult(type);
        } catch (error) {
            console.error("MBTI 저장 중 오류가 발생했습니다:", error);
            alert("결과 저장에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrev = () => {
        if (page === 0) return;
        setPage((p) => p - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRestart = () => {
        setAnswers({});
        setPage(0);
        setResult(null);
        setStarted(false);
        setSelfReportedMbti("");
    };

    if (result) {
        return (
            <div className="max-w-xl mx-auto p-6 text-center">
                <p className="text-gray-500 mb-2">{userName}님의 배드민턴 MBTI는</p>
                <h1 className="text-5xl font-extrabold text-blue-600 mb-4">{result}</h1>
                <p className="text-gray-700 mb-8">{MBTI_DESCRIPTIONS[result]}</p>

                {selfReportedMbti && (
                    <div className="text-left bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                        <p className="text-sm text-gray-500 mb-1">
                            평소 알고 있던 MBTI <b className="text-gray-700">{selfReportedMbti}</b> vs 배드민턴장
                            MBTI <b className="text-blue-700">{result}</b>
                        </p>
                        <p className="text-sm text-gray-700 mt-2">{compareMbti(selfReportedMbti, result)}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                        onClick={handleRestart}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300"
                    >
                        다시 하기
                    </button>
                    <Link
                        href="/indexPage"
                        className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600"
                    >
                        홈으로
                    </Link>
                </div>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="max-w-xl mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">배드민턴 MBTI 테스트</h1>
                <p className="text-gray-600 mb-2">
                    총 <b>40문항</b>, 10문항씩 4페이지로 진행됩니다. 각 문항의 두 문장 중 어느 쪽에 더 가까운지
                    1~5로 골라주세요.
                </p>
                <div className="text-left bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 mt-4">
                    <p className="text-sm font-semibold text-blue-700 mb-2">테스트 전 꼭 읽어주세요</p>
                    <ul className="text-sm text-gray-700 list-disc list-inside flex flex-col gap-1.5">
                        <li>정답은 없습니다. 내가 되고 싶은 이상적인 모습이 아니라, 평소 솔직한 내 모습을 기준으로 답해주세요.</li>
                        <li>비슷해 보이는 문항이 있어도 일부러 앞뒤를 맞추려 애쓰지 말고, 그 문항 자체만 보고 답해주세요.</li>
                        <li>1은 A에 아주 가깝다, 5는 B에 아주 가깝다는 뜻이며, 애매하면 가운데(3)를 골라도 괜찮습니다.</li>
                    </ul>
                </div>
                {initialMbti && (
                    <p className="text-sm text-gray-400 mb-6">이전에 측정한 유형: {initialMbti}</p>
                )}
                <div className="text-left mb-8">
                    <label htmlFor="selfReportedMbti" className="block text-sm font-semibold text-gray-700 mb-1">
                        테스트 전에, 평소 알고 있는 나의 MBTI는 무엇인가요? (선택)
                    </label>
                    <select
                        id="selfReportedMbti"
                        value={selfReportedMbti}
                        onChange={(e) => setSelfReportedMbti(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">잘 모르겠어요 / 건너뛸게요</option>
                        {MBTI_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                        테스트 결과와 비교해서 평소 모습과 코트 안에서의 모습을 분석해 드려요.
                    </p>
                </div>
                <button
                    onClick={() => setStarted(true)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600"
                >
                    시작하기
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4 pb-10">
            <h1 className="text-xl font-bold text-center mb-1">배드민턴 MBTI 테스트</h1>
            <p className="text-center text-sm text-gray-500 mb-6">
                {page + 1} / {TOTAL_PAGES} 페이지 ({page * QUESTIONS_PER_PAGE + 1}~
                {Math.min((page + 1) * QUESTIONS_PER_PAGE, questions.length)}번 문항)
            </p>

            <div className="flex flex-col gap-4">
                {pageQuestions.map((q, idx) => {
                    const value = answers[q.id];
                    return (
                        <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <p className="text-xs text-gray-400 mb-2">
                                {page * QUESTIONS_PER_PAGE + idx + 1}. {q.category}
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-800 mb-3">
                                <p>A. {q.textA}</p>
                                <p className="text-right">B. {q.textB}</p>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                {[1, 2, 3, 4, 5].map((v) => (
                                    <label key={v} className="flex flex-col items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={q.id}
                                            checked={value === v}
                                            onChange={() => handleAnswer(q.id, v)}
                                            className="w-4 h-4 accent-blue-500"
                                        />
                                        <span className="text-[11px] text-gray-400">{v}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 px-1 mt-0.5">
                                <span>A에 가깝다</span>
                                <span>B에 가깝다</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between gap-2 mt-6">
                <button
                    onClick={handlePrev}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    이전
                </button>
                <button
                    onClick={handleNext}
                    disabled={!pageAnswered || isSaving}
                    className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isLastPage ? (isSaving ? "저장 중..." : "결과 보기") : "다음"}
                </button>
            </div>
        </div>
    );
}
