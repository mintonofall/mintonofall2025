"use client";

import { Player, WaitGameListCLass } from "@/lib/interface";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { getWaitGames } from "@/lib/getUserGoHome";
// interface payloadClass {
//     [key: string]: unknown;
//     type: "broadcast";
//     event: string;
// }
const SUPABASE_URL = "https://nwpgfukfmivuzadqxewe.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cGdmdWtmbWl2dXphZHF4ZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODI5MjYsImV4cCI6MjA1MzM1ODkyNn0.1OMI0m8oKEhN-b5FbMrrycqNvC98j5dzf8WPvA4TT8Y";

// Join a room/topic. Can be anything except for 'realtime'.

// Simple function to log any messages we receive
// Subscribe to the Channel

export default function WaitGames(props: { waitGames: WaitGameListCLass[]; players: Player[]; clubid: number }) {
    const [waitGames, setWaitGames] = useState<WaitGameListCLass[]>([]);
    const channelA = useRef<RealtimeChannel | null>(null);
    useEffect(() => {
        setWaitGames(props.waitGames);
    }, []);

    useEffect(() => {
        async function editWaitGames() {
            const newWaitGames = await getWaitGames(props.clubid);
            console.log("newWaitGames : " + JSON.stringify(newWaitGames));
            setWaitGames(newWaitGames);
        }
        console.log("clubid : ");
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        channelA.current = supabase.channel("room-1");
        channelA.current
            .on("broadcast", { event: "waitGames" }, (payload) => {
                console.log("payload to client : " + payload);
                const parsedPayload = payload as { event: string };
                console.log("parsedPayload : " + parsedPayload);
                if (payload.event === "waitGames") {
                    editWaitGames();
                }
            })
            .subscribe();
    }, [props.clubid]);
    function getPlayer(id: number): Player {
        return props.players.filter((player) => player.id === id)[0];
    }
    const getWaitGamePlayerId = (point: number): number => {
        const games = waitGames.find((wait) => wait.point === point);
        const game = games ? games.playerid : 12;
        return game;
    };
    return (
        <div className="grid grid-cols-4 gap-2 mt-1">
            {Array.from({ length: 16 }).map((_, idx) => {
                const playerId = getWaitGamePlayerId(idx);
                const player = getPlayer(playerId);
                return (
                    <div key={idx} className="bg-gray-100 p-2 rounded-lg shadow-md flex flex-col items-center">
                        <span className="text-lg font-medium mb-2">{player.name}</span>
                        <Image
                            src={`${player.avater}/avatar`}
                            width={50}
                            height={50}
                            style={{
                                objectFit: "cover",
                                width: "50px",
                                height: "50px",
                            }}
                            alt=""
                            className="rounded"
                        />
                    </div>
                );
            })}
        </div>
    );
}
