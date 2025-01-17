"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import handleUserCreate from "./action";
import { useActionState } from "react";
import Link from "next/link";

export default function CreateUser() {
    const [, action] = useActionState(handleUserCreate, null);
    const searchParams = useSearchParams();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const name = searchParams.get("name");
        const mail = searchParams.get("email");
        if (name) setUserName(name);
        if (mail) setEmail(mail);
    }, [searchParams]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">사용자 생성</h2>
                    <form action={action} className="flex flex-col">
                        <label htmlFor="userName" className="mb-2 text-gray-700">
                            사용자 이름
                        </label>
                        <input
                            type="text"
                            id="userName"
                            placeholder="사용자 이름"
                            name="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="mb-4 p-2 border border-gray-300 rounded"
                        />
                        <label htmlFor="email" className="mb-2 text-gray-700">
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="이메일"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-4 p-2 border border-gray-300 rounded"
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            생성
                        </button>
                        <Link href="/home">
                            <div className="bg-blue-500 text-center text-white p-2 rounded hover:bg-blue-600">
                                돌아가기
                            </div>
                        </Link>
                    </form>
                </div>
            </div>
        </Suspense>
    );
}
