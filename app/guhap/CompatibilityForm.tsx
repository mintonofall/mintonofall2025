"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCompatibility } from "@/lib/compatibility";

type CompatibilityResult = Awaited<ReturnType<typeof getCompatibility>>;

function scoreLabel(score: number): string {
    if (score >= 90) return "환상의 복식 파트너! 🏆";
    if (score >= 75) return "손발 잘 맞는 좋은 궁합 👍";
    if (score >= 60) return "그럭저럭 괜찮은 조합 🙂";
    return "스타일 차이는 있지만 해볼만해요 🤔";
}

export default function CompatibilityForm({
    userId,
    hasMbti,
    hasSaju,
    initialPartnerUserName,
}: {
    userId: number;
    hasMbti: boolean;
    hasSaju: boolean;
    initialPartnerUserName?: string;
}) {
    const [partnerUserName, setPartnerUserName] = useState(initialPartnerUserName ?? "");
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (nameOverride?: string) => {
        const name = (nameOverride ?? partnerUserName).trim();
        if (!name || isLoading) return;
        setIsLoading(true);
        setResult(null);
        try {
            const res = await getCompatibility(userId, name);
            setResult(res);
        } catch (error) {
            console.error("궁합을 계산하는 중 오류가 발생했습니다:", error);
            setResult({ error: "궁합을 계산하는 중 오류가 발생했습니다." });
        } finally {
            setIsLoading(false);
        }
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

            {!hasMbti && !hasSaju && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-700">
                    아직 MBTI와 민턴사주를 측정하지 않으셨네요. 먼저{" "}
                    <Link href="/mbti" className="underline font-semibold">
                        MBTI
                    </Link>{" "}
                    나{" "}
                    <Link href="/saju" className="underline font-semibold">
                        민턴사주
                    </Link>
                    를 측정하면 더 정확한 궁합을 볼 수 있어요.
                </div>
            )}

            <div className="flex gap-2 mb-8">
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

                    {result.mbti && (
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-semibold text-gray-700">
                                    MBTI 궁합 ({result.mbti.myType} x {result.mbti.partnerType})
                                </p>
                                <p className="text-lg font-bold text-blue-600">{result.mbti.score}점</p>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{result.mbti.description}</p>
                        </div>
                    )}

                    {result.saju && (
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-semibold text-gray-700">
                                    민턴사주 궁합 ({result.saju.myElement} x {result.saju.partnerElement}, {result.saju.relation})
                                </p>
                                <p className="text-lg font-bold text-blue-600">{result.saju.score}점</p>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{result.saju.description}</p>
                        </div>
                    )}

                    {(!result.mbti || !result.saju) && (
                        <p className="text-xs text-gray-400 text-center">
                            {!result.mbti && !result.saju
                                ? ""
                                : `${!result.mbti ? "MBTI" : "민턴사주"} 정보가 없는 쪽이 있어 한쪽 지표만 반영됐어요.`}
                        </p>
                    )}
                </div>
            )}

            <Link href="/indexPage" className="block text-center mt-8 text-gray-500 hover:text-gray-700 text-sm">
                돌아가기
            </Link>
        </div>
    );
}
