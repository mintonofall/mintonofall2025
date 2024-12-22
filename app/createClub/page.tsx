"use client";
// import handleClubCreate from "./action";
import handleClubCreate from "./action";
import { useActionState } from "react";
export default function CreateClub() {
    const [state, action] = useActionState(handleClubCreate, null);
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    클럽 생성
                </h2>
                <form action={action} className="flex flex-col">
                    <label htmlFor="clubname" className="mb-2 text-gray-700">
                        클럽이름
                    </label>
                    <input
                        type="text"
                        id="clubName"
                        placeholder="클럽이름"
                        name="clubName"
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    <label htmlFor="location" className="mb-2 text-gray-700">
                        장소
                    </label>
                    <input
                        type="text"
                        id="location"
                        placeholder="장소"
                        name="clubLocation"
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        클럽생성
                    </button>
                </form>
            </div>
        </div>
    );
}
