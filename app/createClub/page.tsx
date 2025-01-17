"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import handleClubCreate from "./action";
import { useActionState } from "react";
import Link from "next/link";

export default function CreateClub() {
    const [, action] = useActionState(handleClubCreate, null);
    const searchParams = useSearchParams();
    const [clubName, setClubName] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        const name = searchParams.get("name");
        const loc = searchParams.get("location");
        if (name) setClubName(name);
        if (loc) setLocation(loc);
    }, [searchParams]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">클럽 생성</h2>
                    <form action={action} className="flex flex-col">
                        <label htmlFor="clubName" className="mb-2 text-gray-700">
                            클럽 이름
                        </label>
                        <input
                            type="text"
                            id="clubName"
                            placeholder="클럽 이름"
                            name="clubName"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            className="mb-4 p-2 border border-gray-300 rounded"
                        />
                        <label htmlFor="location" className="mb-2 text-gray-700">
                            위치
                        </label>
                        <input
                            type="text"
                            id="location"
                            placeholder="위치"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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
