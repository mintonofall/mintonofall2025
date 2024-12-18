"use client";

import { useState, useEffect } from "react";
import WaitPlayerList from "@/app/component/WaitPlayerList";
import db from "@/lib/db";

export default function GameBoard({ params }: { params: { id: string } }) {
    const [showPlayerList, setShowPlayerList] = useState(false);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        }
        fetchParams();
    }, [params]);

    const togglePlayerList = () => {
        setShowPlayerList((prev) => !prev);
    };

    return (
        <div className="flex h-screen">
            {/* 좌측 화면 */}
            <div className="flex flex-col w-2/3">
                <h5>GameBoard {id}</h5>
                {/* 상단 3 부분 */}
                <div className="h-1/4 bg-gray-200 p-4"></div>

                <div className="flex flex-row h-3/4 p-4">
                    {/* 하단 7 부분 */}
                    <div className="flex flex-col w-10 bg-green-200 ">
                        <div className="grid grid-col-10 h-full gap-1">
                            <div className="bg-red-200">1</div>
                            <div className="bg-blue-200">2</div>
                            <div className="bg-yellow-200">3</div>
                            <div className="bg-purple-200">4</div>
                            <div className="bg-pink-200">5</div>
                            <div className="bg-red-200">1</div>
                            <div className="bg-blue-200">2</div>
                            <div className="bg-yellow-200">3</div>
                            <div className="bg-purple-200">4</div>
                            <div className="bg-pink-200">5</div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="grid grid-rows-10 grid-cols-4 gap-1 h-full">
                            {Array.from({ length: 40 }, (_, index) => (
                                <div key={index} className="bg-gray-300">
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* 우측 화면 */}
            <div className="w-1/3 bg-gray-400 p-4">
                <div>Content for the right screen</div>
            </div>
            {/* 우측 하단 고정 아이콘 */}
            <div className="fixed bottom-4 right-4">
                <button
                    className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
                    onClick={togglePlayerList}
                >
                    <span className="text-3xl">+</span>
                </button>
            </div>
            {showPlayerList && (
                <div className="fixed inset-y-0 right-0 w-1/4 bg-black bg-opacity-50 flex items-center justify-center">
                    <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                        onClick={togglePlayerList}
                    >
                        <span className="text-xl">×</span>
                    </button>
                    <WaitPlayerList />
                </div>
            )}
        </div>
    );
}
