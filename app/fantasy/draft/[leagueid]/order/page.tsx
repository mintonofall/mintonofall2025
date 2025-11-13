"use client";

import { useParams } from "next/navigation";

export default function Order() {
    const params = useParams<{ leagueid: string }>();
    return (
        <div className="container mx-auto p-4 text-center">
            <h2>League ID: {params.leagueid}</h2>
        </div>
    );
}
