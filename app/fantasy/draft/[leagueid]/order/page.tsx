"use client";

import { useParams } from "next/navigation";

export default function Order() {
    const params = useParams<{ leagueid: string }>();
    return (
        <div>
            <h1>teest004</h1>
            <h1>모정건</h1>
            <h2>League ID: {params.leagueid}</h2>
        </div>
    );
}
