"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Player } from "@/lib/interface";

import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { getMatch } from "@/lib/getUserGoHome";

interface GameBoardProps {
    player1id: number;
    player2id: number;
    player3id: number;
    player4id: number;
    id: number;
    clubid: number;
    gameid: string;
    CourtNumber: number;
    updateTime: Date | null;
}
const SUPABASE_URL = "https://nwpgfukfmivuzadqxewe.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cGdmdWtmbWl2dXphZHF4ZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODI5MjYsImV4cCI6MjA1MzM1ODkyNn0.1OMI0m8oKEhN-b5FbMrrycqNvC98j5dzf8WPvA4TT8Y";

export default function GameBoard(props: {
    gameboards: GameBoardProps[];
    players: Player[];
    clubid: number;
    userId: number | undefined;
}) {
    const [gameboards, setGameboards] = useState<GameBoardProps[]>([]);
    const channelB = useRef<RealtimeChannel | null>(null);
    useEffect(() => {
        async function editGameBoards() {
            const newGameBoards = await getMatch(props.clubid);
            console.log("newGameBoards : " + JSON.stringify(newGameBoards));
            setGameboards(newGameBoards);
        }
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        channelB.current = supabase.channel("room-1");
        channelB.current
            .on("broadcast", { event: "gameboards" }, (payload) => {
                console.log("payload to client : " + payload);
                const parsedPayload = payload as { event: string };
                console.log("parsedPayload : " + parsedPayload);
                if (payload.event === "gameboards") {
                    editGameBoards();
                }
            })
            .subscribe();

        return () => {
            if (channelB.current) {
                channelB.current.unsubscribe();
            }
        };
    }, [props.clubid]);

    useEffect(() => {
        setGameboards(props.gameboards);
    }, [props.gameboards]);

    const [isSelect, setIsSelect] = useState(new Array(16).fill(false));

    function getPlayer(id: number): Player {
        return props.players.filter((player) => player.id === id)[0];
    }
    return (
        <div className="flex mt-4 flex-col justify-center gap-2">
            {gameboards.map((gameboard, idx) => (
                <li key={idx} className="bg-gray-100 p-1 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2 text-center">
                        {gameboard.updateTime
                            ? (() => {
                                  const minutesAgo = Math.floor(
                                      (new Date().getTime() - new Date(gameboard.updateTime).getTime()) / 60000
                                  );
                                  if (minutesAgo >= 60) {
                                      return "아주 오래전";
                                  }
                                  return `${minutesAgo}분 전`;
                              })()
                            : "업데이트 시간 없음"}
                    </h2>
                    <div className="flex justify-around items-center">
                        {[gameboard.player1id, gameboard.player2id, gameboard.player3id, gameboard.player4id].map(
                            (playerId, index) => {
                                const player = getPlayer(playerId);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            const newIsSelect = [...isSelect];
                                            newIsSelect[index] = true;
                                            setIsSelect(newIsSelect);
                                        }}
                                        className="flex flex-col items-center"
                                    >
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
                                        <span className="mt-2 text-sm font-medium">{player.name}</span>
                                    </div>
                                );
                            }
                        )}
                        {props.userId ? <div>승부예측</div> : null}
                    </div>
                </li>
            ))}
        </div>
    );
}
