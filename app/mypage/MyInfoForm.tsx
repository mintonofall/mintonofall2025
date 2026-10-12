"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Radar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { updateMyInfo } from "./action";
import { MBTI_DESCRIPTIONS } from "@/lib/mbtiQuestions";
import { ELEMENT_STYLE, type Element, type SajuResult } from "@/lib/sajuTypes";

Chart.register(...registerables);

const MBTI_TYPES = Object.keys(MBTI_DESCRIPTIONS);
const ELEMENT_ORDER: Element[] = ["목", "화", "토", "금", "수"];

export default function MyInfoForm({
    userName,
    nickName,
    point,
    mbti,
    saju,
}: {
    userName: string;
    nickName: string;
    point: number;
    mbti: string | null;
    saju: SajuResult | null;
}) {
    const [state, action, isPending] = useActionState(updateMyInfo, null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    useEffect(() => {
        if (state?.success) {
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
        }
    }, [state]);

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 pt-12">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">내 정보 수정</h1>

                {state?.success && (
                    <p className="text-green-600 text-sm text-center mb-4 bg-green-50 rounded py-2">
                        {state.passwordChanged ? "닉네임과 비밀번호가 변경되었습니다." : "닉네임이 변경되었습니다."}
                    </p>
                )}
                {state?.error && (
                    <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded py-2">{state.error}</p>
                )}

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold text-gray-700">아이디</label>
                    <input
                        type="text"
                        value={userName}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-500"
                    />
                </div>

                <div className="mb-4 text-sm text-gray-600">
                    <span>
                        보유 포인트 <b className="text-blue-600">{point.toLocaleString()}</b>
                    </span>
                </div>

                <div className="mb-6 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">민턴사주 오행 분포</p>
                        <Link href="/saju" className="text-xs text-blue-500 hover:underline">
                            {saju ? "다시 보기" : "사주 보러 가기"}
                        </Link>
                    </div>
                    {saju ? (
                        <>
                            <Radar
                                data={{
                                    labels: ELEMENT_ORDER.map(
                                        (e) => `${ELEMENT_STYLE[e].name} ${ELEMENT_STYLE[e].style}`,
                                    ),
                                    datasets: [
                                        {
                                            label: "오행 분포",
                                            data: ELEMENT_ORDER.map((e) => saju.elementCounts[e]),
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
                            <p className="text-xs text-gray-500 mt-2">
                                타고난 기본 타입: <b>{ELEMENT_STYLE[saju.baseElement].style}</b>
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-4">
                            아직 측정하지 않았어요. 생년월일로 민턴사주를 확인해보세요.
                        </p>
                    )}
                </div>

                <form action={action} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="nickName" className="block mb-1 text-sm font-semibold text-gray-700">
                            닉네임
                        </label>
                        <input
                            id="nickName"
                            name="nickName"
                            type="text"
                            defaultValue={nickName}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="mbti" className="block mb-1 text-sm font-semibold text-gray-700">
                            배드민턴 MBTI
                        </label>
                        <select
                            id="mbti"
                            name="mbti"
                            defaultValue={mbti ?? ""}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        >
                            <option value="">선택 안 함</option>
                            {MBTI_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <Link href="/mbti" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                            테스트로 측정하기
                        </Link>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">비밀번호 변경 (선택)</p>
                        <div className="flex flex-col gap-2">
                            <input
                                name="currentPassword"
                                type="password"
                                placeholder="현재 비밀번호"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                name="newPassword"
                                type="password"
                                placeholder="새 비밀번호"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                name="newPasswordConfirm"
                                type="password"
                                placeholder="새 비밀번호 확인"
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isPending ? "저장 중..." : "저장하기"}
                    </button>
                </form>

                <Link
                    href="/indexPage"
                    className="block text-center mt-4 text-gray-500 hover:text-gray-700 text-sm"
                >
                    돌아가기
                </Link>
            </div>
        </div>
    );
}
