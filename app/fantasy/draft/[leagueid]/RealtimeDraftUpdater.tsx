"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RealtimeDraftUpdaterProps {
    leagueId: number;
}

export default function RealtimeDraftUpdater({ leagueId }: RealtimeDraftUpdaterProps) {
    const router = useRouter();

    useEffect(() => {
        const channel = supabase.channel(`draftPick${leagueId}`);

        channel
            .on("broadcast", { event: "draft-update" }, (payload) => {
                console.log("Draft update received!", payload);
                router.refresh();
            })
            .subscribe();
        console.log(`sbscribing!! draftPick${leagueId} `);

        return () => {
            supabase.removeChannel(channel);
        };
    }, [leagueId, router]);

    return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}
