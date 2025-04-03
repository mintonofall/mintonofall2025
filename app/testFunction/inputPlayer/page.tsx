"use client";
import { useState } from "react";
import { inputWaitPlayer } from "./inputWaitPlayer";
// import { pushWaitPlayerList } from "@/lib/getUserGoHome";

export default function InputPlayer() {
    const [howMany, setHowMany] = useState(30);
    return (
        <div className="flex pt-40 flex-col h-screen">
            <div
                onClick={() => {
                    inputWaitPlayer(howMany);
                }}
            >
                Input Player
            </div>
            <input
                type="number"
                defaultValue={30}
                onChange={(e) => {
                    setHowMany(parseInt(e.target.value, 10));
                }}
            />
            test club에 {howMany}명을 넣습니다.
        </div>
    );
}
