"use client";

import getSessionClient from "@/lib/sessionClient";
import { useEffect, useState } from "react";

export default function Result(params: Promise<{ clubid: number }>) {
    const [user, setUser] = useState(0);
    const [matchList, setMatchList] = useState([]);

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
