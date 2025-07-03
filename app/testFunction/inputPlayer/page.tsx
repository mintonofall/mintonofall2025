"use client";
import { useState } from "react";
import { inputWaitPlayer } from "./inputWaitPlayer";
// import { pushWaitPlayerList } from "@/lib/getUserGoHome";

export default function InputPlayer() {
    const [howMany, setHowMany] = useState(30);
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div
                className="px-6 py-3 mb-6 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
                onClick={() => {
                    inputWaitPlayer(howMany);
                }}
            >
                Input Player
            </div>
            <input
                type="number"
                defaultValue={30}
                className="w-20 p-2 mb-4 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                    setHowMany(parseInt(e.target.value, 10));
                }}
            />
            <p className="text-lg font-medium text-gray-700">
                test club에 <span className="font-bold text-blue-500">{howMany}</span>명을 넣습니다.
            </p>
        </div>
    );
}
