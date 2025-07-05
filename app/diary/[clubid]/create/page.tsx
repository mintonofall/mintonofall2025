"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { handleForm } from "./action";
import { useSearchParams } from "next/navigation";

export default function CreatePlayerMany({ params }: { params: Promise<{ userid: string }> }) {
    const [id, setId] = useState<number | null>(null);
    const [, action] = useActionState(handleForm, null);
    const querys = useSearchParams();

    useEffect(() => {
        async function fetchParams() {
            setId(Number(querys.get("userid")));
            console.log("User ID from params:", querys.get("userid"));
        }
        fetchParams();
    }, [params, id]);
    return (
        <div className="p-4 max-w-3xl mx-auto">
            <form action={action} className="space-y-6">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <label htmlFor={`name${index + 1}`} className="block text-sm font-medium text-gray-700">
                                    이름
                                </label>
                                <input
                                    type="text"
                                    name={`name${index + 1}`}
                                    id={`name${index + 1}`}
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <select
                                    name={`age${index + 1}`}
                                    id={`age${index + 1}`}
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                >
                                    {[20, 30, 40, 50, 60].map((age) => (
                                        <option key={age} value={age} defaultChecked={age === 40}>
                                            {age}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col items-center ">
                                <div className="flex">
                                    <input
                                        type="radio"
                                        id={`man${index + 1}`}
                                        name={`gender${index + 1}`}
                                        value="man"
                                        defaultChecked
                                    />
                                    <label htmlFor={`man${index + 1}`} className="text-sm">
                                        남성
                                    </label>
                                </div>
                                <div className="flex">
                                    <input
                                        type="radio"
                                        id={`woman${index + 1}`}
                                        name={`gender${index + 1}`}
                                        value="woman"
                                    />
                                    <label htmlFor={`woman${index + 1}`} className="text-sm">
                                        여성
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div>
                                    {["S", "A", "B"].map((grade) => (
                                        <div key={grade}>
                                            <input
                                                type="radio"
                                                id={`${grade}${index + 1}`}
                                                name={`grade${index + 1}`}
                                                value={grade}
                                                defaultChecked={grade === "A"}
                                                className="mr-1"
                                            />
                                            <label htmlFor={`${grade}${index + 1}`} className="text-sm">
                                                {grade}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    {["C", "D", "E"].map((grade) => (
                                        <div key={grade}>
                                            <input
                                                type="radio"
                                                id={`${grade}${index + 1}`}
                                                name={`grade${index + 1}`}
                                                value={grade}
                                                defaultChecked={grade === "A"}
                                                className="mr-1"
                                            />
                                            <label htmlFor={`${grade}${index + 1}`} className="text-sm">
                                                {grade}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <input type="hidden" name="userid" value={String(id)} />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    선수등록
                </button>
                <Link href={`/diary/${id}`}>
                    <div className="mt-4 bg-gray-500 text-center text-white p-2 rounded hover:bg-gray-600">
                        돌아가기
                    </div>
                </Link>
            </form>
        </div>
    );
}
