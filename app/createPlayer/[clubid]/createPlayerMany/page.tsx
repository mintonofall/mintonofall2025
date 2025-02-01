"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { handleForm } from "./action";

export default function CreatePlayerMany({ params }: { params: Promise<{ clubid: string }> }) {
    const [id, setId] = useState<number | null>(null);
    const [, action] = useActionState(handleForm, null);
    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).clubid;
            setId(parseInt(resolvedParams));
            console.log(id);
            console.log(resolvedParams);
        }
        fetchParams();
    }, [params, id]);
    return (
        <div className="p-4 max-w-3xl mx-auto">
            <form action={action} className="space-y-6">
                {[...Array(10)].map((_, index) => (
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
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`man${index + 1}`}
                                    name={`gender${index + 1}`}
                                    value="man"
                                    defaultChecked
                                    className="mr-1"
                                />
                                <label htmlFor={`man${index + 1}`} className="text-sm">
                                    남성
                                </label>
                                <input
                                    type="radio"
                                    id={`woman${index + 1}`}
                                    name={`gender${index + 1}`}
                                    value="woman"
                                    className="mr-1"
                                />
                                <label htmlFor={`woman${index + 1}`} className="text-sm">
                                    여성
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                {["S", "A", "B", "C", "D", "E"].map((grade) => (
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
                ))}
                <input type="hidden" name="clubid" value={String(id)} />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    선수등록
                </button>
                <Link href={`/home/${id}`}>
                    <div className="mt-4 bg-gray-500 text-center text-white p-2 rounded hover:bg-gray-600">
                        돌아가기
                    </div>
                </Link>
            </form>
        </div>
    );
}
