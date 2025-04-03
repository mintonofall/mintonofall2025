"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import handleClubCreate from "./action";
import { useActionState } from "react";
import Link from "next/link";
import { getClub } from "@/lib/getUserGoHome";

function CreateClubContent({ params }: { params: Promise<{ id: string }> }) {
    const [, action] = useActionState(handleClubCreate, null);
    const searchParams = useSearchParams();
    const [clubName, setClubName] = useState("");
    const [location, setLocation] = useState("");
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const name = searchParams.get("name");
        const loc = searchParams.get("location");
        if (name) setClubName(name);
        if (loc) setLocation(loc);
    }, [searchParams]);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).id;
            setId(resolvedParams);
            console.log(resolvedParams);
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchParams() {
            if (id) {
                const data = await getClub(Number(id));
                if (data) {
                    console.log(data);
                    setClubName(data.clubName || "");
                    setLocation(data.clubLocation || "");
                }
            }
        }
        fetchParams();
    }, [id]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">클럽 수정</h2>
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
                        name="clubLocation"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    <div className="mb-4">
                        <span className="text-gray-700">코트 수:</span>
                        <div className="flex items-center mt-2">
                            <label className="mr-4 flex items-center">
                                <input
                                    type="radio"
                                    id="howManyCourts3"
                                    name="howManyCourts"
                                    value="3"
                                    defaultChecked
                                    className="mr-2"
                                />
                                3
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    id="howManyCourts4"
                                    name="howManyCourts"
                                    value="4"
                                    className="mr-2"
                                />
                                4
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    id="howManyCourts4"
                                    name="howManyCourts"
                                    value="6"
                                    className="mr-2"
                                />
                                6
                            </label>
                        </div>
                    </div>
                    <input type="hidden" name="id" value={id ?? ""} />
                    <button type="submit" className="bg-blue-500 text-white p-2 mb-2 rounded hover:bg-blue-600">
                        수정
                    </button>
                    <Link href={`/home/${id}`}>
                        <div className="bg-blue-500 text-center text-white p-2 rounded hover:bg-blue-600">돌아가기</div>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default function CreateClub({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateClubContent params={params} />
        </Suspense>
    );
}
