"use client";

import { useState } from "react";
import Link from "next/link";
import { COMM_QUESTIONS, PLAY_QUESTIONS, type StyleLetter } from "@/lib/styleQuestions";
import type { StyleResult } from "@/lib/styleTypes";
import { saveStyleResult } from "@/lib/style";

export default function StyleTest({
    userId,
    userName,
    initialResult,
}: {
    userId: number;
    userName: string;
    initialResult: StyleResult | null;
}) {
    const [started, setStarted] = useState(false);
    const [page, setPage] = useState(0); // 0 = 소통·멘탈, 1 = 플레이 스타일
    const [answers, setAnswers] = useState<Record<string, StyleLetter>>({});
    const [result, setResult] = useState<StyleResult | null>(initialResult);
    const [isSaving, setIsSaving] = useState(false);

    const pageQuestions = page === 0 ? COMM_QUESTIONS : PLAY_QUESTIONS;
    const pageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);
    const isLastPage = page === 1;

    const handleSelect = (questionId: string, letter: StyleLetter) => {
        setAnswers((prev) => ({ ...prev, [questionId]: letter }));
    };

    const handleNext = async () => {
        if (!pageAnswered) return;
        if (!isLastPage) {
            setPage(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const comm = COMM_QUESTIONS.map((q) => answers[q.id]);
        const play = PLAY_QUESTIONS.map((q) => answers[q.id]);
        setIsSaving(true);
        try {
            const saved = await saveStyleResult(userId, comm, play);
            setResult(saved);
        } catch (error) {
            console.error("민턴스타일 저장 중 오류가 발생했습니다:", error);
            alert("결과 저장에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePrev = () => {
        if (page === 0) return;
        setPage(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRestart = () => {
        setAnswers({});
        setPage(0);
        setResult(null);
        setStarted(false);
    };

    if (result) {
        return (
            <div className="max-w-xl mx-auto p-6 text-center">
                <p className="text-gray-500 mb-2">{userName}님의 민턴스타일</p>
                <h1 className="text-2xl font-bold mb-6">측정이 완료됐어요</h1>

                <div className="text-left bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-blue-700 mb-2">소통·멘탈</p>
                    <p className="text-sm text-gray-700">
                        {result.comm
                            .map((letter, i) => COMM_QUESTIONS[i].options.find((o) => o.letter === letter)?.tag)
                            .join(", ")}
                    </p>
                </div>
                <div className="text-left bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                    <p className="text-sm font-semibold text-blue-700 mb-2">플레이 스타일</p>
                    <p className="text-sm text-gray-700">
                        {result.play
                            .map((letter, i) => PLAY_QUESTIONS[i].options.find((o) => o.letter === letter)?.tag)
                            .join(", ")}
                    </p>
                </div>

                <p className="text-sm text-gray-500 mb-8">
                    <Link href="/guhap" className="text-blue-500 underline font-semibold">
                        민턴궁합
                    </Link>
                    에서 상대와의 스타일 궁합을 확인해보세요.
                </p>

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
                <h1 className="text-2xl font-bold mb-4">민턴스타일</h1>
                <p className="text-gray-600 mb-2">
                    소통·멘탈 5문항, 플레이 스타일 5문항, 총 10문항이에요. 정답은 없으니 평소 코트 위 내 모습에
                    가까운 보기를 골라주세요.
                </p>
                {initialResult && <p className="text-sm text-gray-400 mb-6 mt-2">이전에 측정한 기록이 있어요.</p>}
                <button
                    onClick={() => setStarted(true)}
                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600"
                >
                    시작하기
                </button>
                <Link href="/indexPage" className="block text-center mt-6 text-gray-500 hover:text-gray-700 text-sm">
                    돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4 pb-10">
            <h1 className="text-xl font-bold text-center mb-1">민턴스타일</h1>
            <p className="text-center text-sm text-gray-500 mb-6">
                {page + 1} / 2 페이지 ({page === 0 ? "소통·멘탈" : "플레이 스타일"})
            </p>

            <div className="flex flex-col gap-4">
                {pageQuestions.map((q, idx) => {
                    const selected = answers[q.id];
                    return (
                        <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <p className="text-xs text-gray-400 mb-1">
                                {page * 5 + idx + 1}. {q.title}
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mb-3">{q.text}</p>
                            <div className="flex flex-col gap-2">
                                {q.options.map((opt) => (
                                    <button
                                        key={opt.letter}
                                        type="button"
                                        onClick={() => handleSelect(q.id, opt.letter)}
                                        className={`text-left text-sm px-3 py-2 rounded border ${
                                            selected === opt.letter
                                                ? "bg-blue-500 text-white border-blue-500"
                                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        {opt.letter}. {opt.text}
                                    </button>
                                ))}
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
