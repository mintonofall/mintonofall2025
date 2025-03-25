"use client";

import getSessionClient from "@/lib/sessionClient";
import { useEffect, useState } from "react";

export default function Result(params: Promise<{ clubid: string }>) {
    const [user, setUser] = useState(0);

    useEffect(() => {
        async function fetchParams() {
            const session = await getSessionClient();
            console.log("session : ", session);
            if (session) {
                setUser(Number(session.id));
            }
            const resolvedParams = (await params).clubid;
            console.log("clubid : ", resolvedParams);
        }
        fetchParams();
    }, []);

    return (
        <div>
            <div>
                <h1>Result {user}</h1>
            </div>
        </div>
    );
}
