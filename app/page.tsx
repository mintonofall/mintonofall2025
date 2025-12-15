"use client";
import Image from "next/image";
import handleLogin from "./action";
import Link from "next/link";
import { useActionState } from "react";
import Head from "next/head";

export default function Home() {
    const [state, action] = useActionState(handleLogin, null);
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                ></meta>
            </Head>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
                <Image src="/logo512.png" alt="Mintonofall Logo" width={300} height={300} className="mb-8" />
                <form action={action} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            name="userName"
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <span className="text-red-600 text-xs italic">{state?.error?.uniqueUser ?? ""}</span>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <span className="text-red-600 text-xs italic"></span>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            로그인
                        </button>
                    </div>
                </form>
                <Link href={"/createUser"} className="mt-4 text-blue-500 hover:text-blue-700">
                    가입하기
                </Link>
                {/* <Link href={"/noUserClubList"} className="mt-4 text-blue-500 hover:text-blue-700">
                    비회원으로 이용하기
                </Link> */}
            </div>
        </>
    );
}
