"use client";

import { useState, useEffect } from "react";
import WaitPlayerList from "@/app/component/WaitPlayerList";
import FromIdtoPlayerCard from "@/app/component/FromIdtoPlayerCard";
import db from "@/lib/db";
import {
    createWaitGame,
    getWaitPlayerList,
    pushWaitPlayerList,
} from "@/lib/getUserGoHome";
interface GameBoard {
    pointer: number;
    clubid: number;
    playerid: number;
}

export default function GameBoard({ params }: { params: { id: string } }) {
    const [showPlayerList, setShowPlayerList] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const [waitPlayerList, setWaitPlayerList] = useState<number[]>([]);
    const [gamePointer, setGamePointer] = useState<number>(0);
    const [waitGameListId, setWaitGameListId] = useState<GameBoard[]>([]);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchWaitPlayerList() {
            if (id) {
                try {
                    const response = await getWaitPlayerList(Number(id));
                    console.log(response);

                    const playerIds = response.map((player) => player.Playerid);

                    setWaitPlayerList(playerIds);
                } catch (error) {
                    console.error("Failed to fetch wait player list:", error);
                }
            }
        }
        fetchWaitPlayerList();
    }, [id]);

    const togglePlayerList = () => {
        setShowPlayerList((prev) => !prev);
    };

    const enrterWaitGame = async (playerid: number) => {
        const waitGame: GameBoard = {
            pointer: gamePointer,
            playerid: playerid,
            clubid: Number(id),
        };
        const copys = [...waitGameListId];
        const existingPlayerIndex = copys.findIndex(
            (game) => game.pointer === waitGame.pointer
        );
        console.log("Existing player index:", existingPlayerIndex);
        if (existingPlayerIndex !== -1) {
            console.log("Player already in the wait game list");
            copys[existingPlayerIndex].playerid = waitGame.playerid;
            await setWaitGameListId(copys);
            const pointer = gamePointer + 1;
            await setGamePointer(pointer);
            return;
        }
        await copys.push(waitGame);
        setWaitGameListId(copys);
        console.log(copys);
        const pointer = gamePointer + 1;
        await setGamePointer(pointer);
        const createWaitGames = createWaitGame(
            Number(id),
            playerid,
            gamePointer
        );
    };

    const closePlayerList = () => {
        setShowPlayerList(false);
    };

    const enterPlayer = (playerId: number) => {
        console.log(playerId);
        pushWaitPlayerList(playerId, Number(id));
    };

    return (
        <div className="flex h-screen">
            {/* 좌측 화면 */}
            <div className="flex flex-col w-3/4">
                <h5>GameBoard {id}</h5>
                {/* 상단 3 부분 */}
                <div className="h-1/4 bg-gray-200 p-4"></div>

                <div className="flex flex-row h-3/4 p-4">
                    {/* 하단 7 부분 */}
                    <div className="flex flex-col w-10 bg-green-200 ">
                        <div className="grid h-full gap-1 *:flex *:justify-center *:items-center">
                            <div className="bg-red-200">+</div>
                            <div className="bg-blue-200">+</div>
                            <div className="bg-yellow-200">+</div>
                            <div className="bg-purple-200">+</div>
                            <div className="bg-pink-200">+</div>
                            <div className="bg-red-200">+</div>
                            <div className="bg-blue-200">+</div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="grid grid-rows-7 grid-cols-4 gap-1 w-full h-full ">
                            {Array.from({ length: 28 }, (_, index) => (
                                <div
                                    key={index}
                                    className={
                                        gamePointer == index
                                            ? "bg-red-200"
                                            : "bg-blue-200"
                                    }
                                    onClick={async (e) => {
                                        await setGamePointer(index);
                                        console.log(gamePointer);
                                    }}
                                >
                                    {waitGameListId.map((game) => {
                                        return game.pointer == index ? (
                                            <FromIdtoPlayerCard
                                                playerid={game.playerid}
                                                clubid={Number(id)}
                                                which={"waitGame"}
                                            />
                                        ) : null;
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* 우측 화면 */}
            <div className="w-1/4 bg-gray-400 p-4">
                <div>
                    {waitPlayerList.map((playerid) => {
                        return (
                            <div
                                key={playerid}
                                className="flex flex-col"
                                onClick={() => {
                                    enrterWaitGame(playerid);
                                }}
                            >
                                <div key={playerid}>
                                    {
                                        <FromIdtoPlayerCard
                                            playerid={playerid}
                                            clubid={Number(id)}
                                            which={"waitPlayer"}
                                        />
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* ClearList Button */}
                <button
                    className="bg-red-500 text-white rounded-xl w-32 h-12 flex items-center justify-center shadow-lg mt-4"
                    onClick={() => {
                        if (confirm("Are you sure?")) {
                            setWaitPlayerList([]);
                        }
                    }}
                >
                    Clear List
                </button>
            </div>
            {/* 우측 하단 고정 아이콘 */}
            <div className="fixed bottom-4 right-4">
                <button
                    className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
                    onClick={togglePlayerList}
                >
                    <span className="text-3xl">+</span>
                </button>
            </div>
            {showPlayerList && (
                <div className="fixed top-0 right-0 w-1/4 bg-black bg-opacity-50 flex items-center justify-center">
                    <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                        onClick={togglePlayerList}
                    >
                        <span className="text-xl">×</span>
                    </button>
                    <WaitPlayerList
                        onClose={closePlayerList}
                        onEnterPlayer={enterPlayer}
                        waitPLayerList={waitPlayerList}
                        clubId={Number(id)}
                    />
                </div>
            )}
        </div>
    );
}
