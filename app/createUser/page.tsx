"use client";
import handleSignup from "./action";
import { useActionState } from "react";
import Link from "next/link";

export default function SignupPage() {
    const [state, action] = useActionState(handleSignup, null);
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
                <form action={action} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 mb-2">
                            유저이름:
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
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        가입신청
                    </button>
                    {state?.error && <span className="text-red-500">{state.error}</span>}
                    <div className="w-full text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        <Link href={"/"}>돌아가기</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
