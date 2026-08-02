"use client";
import Image from "next/image";
import handleLogin from "./action";
import Link from "next/link";
import { useActionState } from "react";

export default function Home() {
    const [state, action] = useActionState(handleLogin, null);
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-linear-to-b from-emerald-50 via-white to-white">
                <Image src="/logo512.png" alt="Mintonofall Logo" width={160} height={160} className="mb-6 drop-shadow-sm" />
                <form action={action} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-slate-600 text-sm font-medium mb-1.5">
                            Username
                        </label>
                        <input
                            id="username"
                            name="userName"
                            type="text"
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-shadow"
                        />
                        <span className="text-rose-500 text-xs mt-1 block">{state?.error?.uniqueUser ?? ""}</span>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-slate-600 text-sm font-medium mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-shadow"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white font-semibold py-2.5 px-4 rounded-full shadow-sm transition-all"
                        >
                            로그인
                        </button>
                    </div>
                </form>
                <Link href={"/createUser"} className="mt-5 text-emerald-600 hover:text-emerald-700 font-medium">
                    가입
                </Link>
                {/* <Link href={"/gametable/game-plan"} className="mt-4 text-emerald-500 hover:text-emerald-700">
                    개판 전국모임
                </Link> */}
                {/* <Link href={"/noUserClubList"} className="mt-4 text-emerald-500 hover:text-emerald-700">
                    비회원으로 이용하기
                </Link> */}
            </div>
        </>
    );
}
