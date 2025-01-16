"use client";
import { useSearchParams } from "next/navigation";
// import handleClubCreate from "./action";
import handleClubCreate from "./action";
import { useActionState } from "react";
export default function CreateClub() {
    const params = useSearchParams();
    console.log(params);
    const [, action] = useActionState(handleClubCreate, null);
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">클럽 생성</h2>
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
                    <div className="flex flex-col space-y-2">
                        <span className="text-gray-700">코트갯수</span>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="howManyCourts" value={3} id="howManyCourts" defaultChecked />
                                <span>3</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="howManyCourts" value={4} id="howManyCourts" />
                                <span>4</span>
                            </label>
                        </div>
                    </div>
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
