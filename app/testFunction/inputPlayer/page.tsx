"use client";
import { useState } from "react";
import { inputWaitPlayer } from "./inputWaitPlayer";
// import { pushWaitPlayerList } from "@/lib/getUserGoHome";

export default function InputPlayer() {
    const [howMany, setHowMany] = useState(30);
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-linear-to-b from-emerald-50 via-white to-white">
            <div
                className="px-6 py-3 mb-6 text-white bg-emerald-500 rounded-lg cursor-pointer hover:bg-emerald-600"
                onClick={() => {
                    inputWaitPlayer(howMany);
                }}
            >
                Input Player
            </div>
            <input
                type="number"
                defaultValue={30}
                className="w-20 p-2 mb-4 text-center border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => {
                    setHowMany(parseInt(e.target.value, 10));
                }}
            />
            <p className="text-lg font-medium text-slate-700">
                test club에 <span className="font-bold text-emerald-500">{howMany}</span>명을 넣습니다.
            </p>
        </div>
    );
}
