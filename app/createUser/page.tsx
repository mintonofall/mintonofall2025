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
            className="w-full bg-blue-500 text-white font-semibold p-2.5 rounded-full shadow-sm hover:bg-blue-600 active:scale-[0.99] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
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
                <label htmlFor="username" className="block text-slate-600 text-sm font-medium mb-1.5">
                    ID
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow"
                    required
                />
            </div>
            <div>
                <label htmlFor="nickname" className="block text-slate-600 text-sm font-medium mb-1.5">
                    대화명
                </label>
                <input
                    type="text"
                    id="nickname"
                    name="nickName"
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-slate-600 text-sm font-medium mb-1.5">
                    패스워드
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow"
                    required
                />
            </div>
            <div>
                <label htmlFor="passwordconfirm" className="block text-slate-600 text-sm font-medium mb-1.5">
                    패스워드 확인
                </label>
                <input
                    type="password"
                    id="passwordconfirm"
                    name="passwordconfirm"
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow"
                    required
                />
            </div>
            <SubmitButton />
            {state?.error && <span className="text-rose-500 text-sm text-center">{state.error}</span>}
            <Link
                href={clubId ? `/home/${clubId}/viewPage` : "/"}
                className="w-full text-center text-slate-500 hover:text-blue-600 font-medium p-2 transition-colors"
            >
                돌아가기
            </Link>
        </form>
    );
}

export default function SignupPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-b from-blue-50 via-white to-white px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-md">
                <h2 className="text-2xl font-extrabold mb-6 text-center text-slate-800">
                    회원가입 <span className="text-blue-500">🏸</span>
                </h2>
                <Suspense fallback={<div className="text-center text-slate-400">로딩 중...</div>}>
                    <SignupForm />
                </Suspense>
            </div>
        </div>
    );
}
