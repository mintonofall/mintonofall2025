"use client";
import handleSignUp from "./action";
import { useActionState } from "react";

export default function CreateUser() {
    const [state, action] = useActionState(handleSignUp, null);
    return (
        <form
            action={action}
            className="flex flex-col items-center max-w-screen-sm p-4 bg-white shadow-md rounded-lg"
        >
            <div className="mb-4 w-full">
                <label
                    htmlFor="username"
                    className="block text-gray-700 font-bold mb-2"
                >
                    유저이름:
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4 w-full">
                <label
                    htmlFor="password"
                    className="block text-gray-700 font-bold mb-2"
                >
                    패스워드:
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4 w-full">
                <label
                    htmlFor="passwordconfirm"
                    className="block text-gray-700 font-bold mb-2"
                >
                    패스워드확인:
                </label>
                <input
                    type="password"
                    id="passwordconfirm"
                    name="passwordconfirm"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
            >
                가입신청
            </button>
            <span className="text-red-500 mt-2">{state?.error ?? ""}</span>
        </form>
    );
}
