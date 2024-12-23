"use client";

import { useState, useEffect } from "react";
import WaitPlayerList from "@/app/component/WaitPlayerList";
import FromIdtoPlayerCard from "@/app/component/FromIdtoPlayerCard";
import GameCourt from "@/app/component/GameCourt";
// import "@picocss/pico";
import db from "@/lib/db";
import {
    createWaitGame,
    getWaitGames,
    getWaitPlayerList,
    pushWaitPlayerList,
    updateWaitGame,
} from "@/lib/getUserGoHome";
interface GameBoard {
    pointer: number;
    clubid: number;
    playerid: number;
}
interface PlayingGameBoard {
    id?: number;
    court?: number;
    clubid?: number;
    player1id?: number;
    player2id?: number;
    player3id?: number;
    player4id?: number;
}

export default function GameBoard({ params }: { params: { id: string } }) {
    const [showPlayerList, setShowPlayerList] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const [waitPlayerList, setWaitPlayerList] = useState<number[]>([]);
    const [gamePointer, setGamePointer] = useState<number>(0);
    const [waitGameListId, setWaitGameListId] = useState<GameBoard[]>([]);
    const [boardPointer, setBoardPointer] = useState<number>(0);
    const [game1, setGame1] = useState<PlayingGameBoard>();
    const [game2, setGame2] = useState<PlayingGameBoard>();
    const [game3, setGame3] = useState<PlayingGameBoard>();

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

    useEffect(() => {
        async function fetchWaitPlayerList() {
            if (id) {
                try {
                    const response = await getWaitGames(Number(id));
                    const newWaitGameListId: GameBoard[] = response.map(
                        (game) => {
                            return {
                                pointer: game.point,
                                playerid: game.playerid,
                                clubid: game.clubid,
                            };
                        }
                    );
                    setWaitGameListId(newWaitGameListId);
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

    const startGame1 = async (
        p1: number,
        p2: number,
        p3: number,
        p4: number,
        court: number
    ) => {
        await setGame1({
            court: boardPointer,
            clubid: Number(id),
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
        });
    };

    const startGame2 = async (
        p1: number,
        p2: number,
        p3: number,
        p4: number,
        court: number
    ) => {
        setGame2({
            court: boardPointer,
            clubid: Number(id),
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
        });
    };

    const startGame3 = async (
        p1: number,
        p2: number,
        p3: number,
        p4: number,
        court: number
    ) => {
        setGame3({
            court: boardPointer,
            clubid: Number(id),
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
        });
    };

    const enterWaitGame = async (playerid: number) => {
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
            const updateWaitGams = updateWaitGame(playerid, waitGame.pointer);
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

    const inputGame = (point: number, boardPointer: number) => {
        if (boardPointer == 0) {
            startGame1(
                waitGameListId[point].playerid,
                waitGameListId[point + 1].playerid,
                waitGameListId[point + 2].playerid,
                waitGameListId[point + 3].playerid,
                0
            );
        } else if (boardPointer == 1) {
            startGame2(
                waitGameListId[point + 0].playerid,
                waitGameListId[point + 1].playerid,
                waitGameListId[point + 2].playerid,
                waitGameListId[point + 3].playerid,
                1
            );
        } else if (boardPointer == 2) {
            startGame3(
                waitGameListId[point + 0].playerid,
                waitGameListId[point + 1].playerid,
                waitGameListId[point + 2].playerid,
                waitGameListId[point + 3].playerid,
                2
            );
        }
    };

    return (
        <div className="flex h-screen">
            {/* 좌측 화면 */}
            <div className="flex flex-col w-3/4">
                {/* GameCourt 3 */}
                {/* 상단 3 부분 */}
                <div className="h-1/4 bg-gray-200 p-0">
                    <div className="flex flex-row justify-between h-full">
                        <div
                            className={`w-1/3 ${
                                boardPointer == 0
                                    ? "bg-green-500"
                                    : "bg-blue-100"
                            } p-0`}
                            onClick={() => {
                                setBoardPointer(0);
                            }}
                        >
                            <GameCourt
                                p1={game1?.player1id ?? 12}
                                p2={game1?.player2id ?? 12}
                                p3={game1?.player3id ?? 12}
                                p4={game1?.player4id ?? 12}
                                clubid={Number(id)}
                            />

                            {game1?.player1id}
                            {game1?.player2id}
                            {game1?.player3id}
                            {game1?.player4id}
                        </div>
                        <div
                            className={`w-1/3  ${
                                boardPointer == 1
                                    ? "bg-green-500"
                                    : "bg-blue-100"
                            }`}
                            onClick={() => {
                                setBoardPointer(1);
                            }}
                        >
                            <div>Court 2</div>
                            {game2?.player1id}
                            {game2?.player2id}
                            {game2?.player3id}
                            {game2?.player4id}
                        </div>
                        <div
                            className={`w-1/3 ${
                                boardPointer == 2
                                    ? "bg-green-500"
                                    : "bg-blue-100"
                            } p-0`}
                            onClick={() => {
                                setBoardPointer(2);
                            }}
                        >
                            <div>Court 3</div>
                            {game3?.player1id}
                            {game3?.player2id}
                            {game3?.player3id}
                            {game3?.player4id}
                        </div>
                    </div>
                </div>

                <div className="flex flex-row h-3/4 p-4">
                    {/* 하단 7 부분 */}
                    <div className="flex flex-row w-10 justify-center bg-green-200 ">
                        <div className="grid h-full gap-1 *:flex *:justify-center *:items-center *:text-2xl">
                            <div
                                className="bg-red-200"
                                onClick={() => {
                                    inputGame(0, boardPointer);
                                }}
                            >
                                +
                            </div>
                            <div
                                className="bg-blue-200"
                                onClick={() => {
                                    inputGame(4, boardPointer);
                                }}
                            >
                                +
                            </div>
                            <div
                                className="bg-yellow-200"
                                onClick={() => {
                                    inputGame(8, boardPointer);
                                }}
                            >
                                +
                            </div>
                            <div
                                className="bg-purple-200"
                                onClick={() => {
                                    inputGame(12, boardPointer);
                                }}
                            >
                                +
                            </div>
                            <div
                                className="bg-pink-200"
                                onClick={() => {
                                    inputGame(16, boardPointer);
                                }}
                            >
                                +
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow grid grid-cols-4 gap-1">
                        {Array.from({ length: 20 }, (_, index) => (
                            <div
                                key={index}
                                className={`w-100 ${
                                    gamePointer == index
                                        ? "bg-red-200"
                                        : "bg-blue-200"
                                }`}
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
            {/* 우측 화면 */}
            <div className="w-1/4 bg-gray-400 p-4">
                <div>
                    {waitPlayerList.map((playerid) => {
                        return (
                            <div
                                key={playerid}
                                className="flex flex-col"
                                onClick={() => {
                                    enterWaitGame(playerid);
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
                <div className="fixed top-0 right-0 w-full bg-black bg-opacity-50 flex flex-wrap items-center justify-center">
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
