"use client";
import getPlayerList from "@/lib/getPlayerList";

import WaitPlayerList from "../component/WaitPlayerList";

export default function Test() {
    return (
        <div>
            <WaitPlayerList onClose={() => {}} />
        </div>
    );
}
