"use client";
import { getWin } from "@/lib/getClubDiary";
import getSessionClient from "@/lib/sessionClient";
import { useEffect, useState } from "react";

export default function StatHome({ params }: { params: Promise<{ userid: number }> }) {
    const [userid, setUserid] = useState(0);
    const [wins, setWins] = useState<number[]>([]);
    useEffect(() => {
        async function fetchParams() {
            const session = await getSessionClient();
            setUserid(Number(session!.id));
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchMatch() {
            const matchs = await getWin(userid);
            console.log(matchs);
            setWins(matchs);
        }
        fetchMatch();
    }, [userid]);

    return (
        <div>
            stat home{userid}
            <div>
                {wins[0]}승 {wins[1]}패
            </div>
            <div>{wins[2]} 득점</div>
            <div>{wins[3]} 실점</div>
        </div>
    );
}
