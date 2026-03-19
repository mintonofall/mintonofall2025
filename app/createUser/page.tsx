"use client";
import handleSignup from "./action";
import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {pending ? "가입 처리중..." : "가입신청"}
        </button>
    );
}

function SignupForm() {
    const [state, action] = useActionState(handleSignup, null);
    const searchParams = useSearchParams();
    const clubId = searchParams.get("clubId");

    return (
        <form action={action} className="flex flex-col space-y-4">
            {clubId && <input type="hidden" name="clubId" value={clubId} />}
            <div>
                <label htmlFor="username" className="block text-gray-700 mb-2">
                    ID:
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="nickname" className="block text-gray-700 mb-2">
                    대화명:
                </label>
                <input
                    type="text"
                    id="nickname"
                    name="nickName"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                    패스워드:
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="passwordconfirm" className="block text-gray-700 mb-2">
                    패스워드확인:
                </label>
                <input
                    type="password"
                    id="passwordconfirm"
                    name="passwordconfirm"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <SubmitButton />
            {state?.error && <span className="text-red-500">{state.error}</span>}
            <div className="w-full text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                <Link href={clubId ? `/home/${clubId}/viewPage` : "/"}>돌아가기</Link>
            </div>
        </form>
    );
}

export default function SignupPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
                <Suspense fallback={<div className="text-center text-gray-500">로딩 중...</div>}>
                    <SignupForm />
                </Suspense>
            </div>
        </div>
    );
}
