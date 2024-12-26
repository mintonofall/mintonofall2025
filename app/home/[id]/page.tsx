"use client";

import { useState, useEffect } from "react";
import WaitPlayerList from "@/app/component/WaitPlayerList";
import FromIdtoPlayerCard from "@/app/component/FromIdtoPlayerCard";
import GameCourt from "@/app/component/GameCourt";
import {
    createWaitGame,
    getWaitGames,
    getWaitPlayerList,
    pushWaitPlayerList,
    startMatch,
    updateWaitGame,
    deleteWaitGame,
    pushUpWaitGame,
    getMatch,
    createMatch,
    gameOneUp,
} from "@/lib/getUserGoHome";
interface GameBoard {
    pointer: number;
    clubid: number;
    playerid: number;
}

interface PageProps {
    params: Promise<{ id: string }>;
}
interface PlayingGameBoard {
    id?: number;
    gameid: number | null;
    court?: number;
    clubid?: number;
    player1id?: number;
    player2id?: number;
    player3id?: number;
    player4id?: number;
}

export default function GameBoard({ params }: { params: PageProps }) {
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
                    const newWaitGameListId: GameBoard[] = response.map((game) => {
                        return {
                            pointer: game.point,
                            playerid: game.playerid,
                            clubid: game.clubid,
                        };
                    });
                    const newPointer = response.length;
                    setGamePointer(newPointer);
                    setWaitGameListId(newWaitGameListId);
                } catch (error) {
                    console.error("Failed to fetch wait player list:", error);
                }
            }
        }
        fetchWaitPlayerList();
    }, [id]);

    useEffect(() => {
        async function fetchGame1() {
            if (id) {
                try {
                    const response = await getMatch(Number(id), 1);
                    const newGame: PlayingGameBoard = {
                        id: response[0].id,
                        gameid: response[0].gameid || null,
                        court: response[0].CourtNumber,
                        clubid: response[0].clubid,
                        player1id: response[0].player1id,
                        player2id: response[0].player2id,
                        player3id: response[0].player3id,
                        player4id: response[0].player4id,
                    };
                    setGame1(newGame);
                    const response2 = await getMatch(Number(id), 2);
                    const newGame2: PlayingGameBoard = {
                        id: response2[0].id,
                        gameid: response2[0].gameid || null,
                        court: response2[0].CourtNumber,
                        clubid: response2[0].clubid,
                        player1id: response2[0].player1id,
                        player2id: response2[0].player2id,
                        player3id: response2[0].player3id,
                        player4id: response2[0].player4id,
                    };
                    setGame2(newGame2);
                    const response3 = await getMatch(Number(id), 3);
                    const newGame3: PlayingGameBoard = {
                        id: response3[0].id,
                        gameid: response3[0].gameid || null,
                        court: response3[0].CourtNumber,
                        clubid: response3[0].clubid,
                        player1id: response3[0].player1id,
                        player2id: response3[0].player2id,
                        player3id: response3[0].player3id,
                        player4id: response3[0].player4id,
                    };
                    setGame3(newGame3);
                } catch (error) {
                    console.error("Failed to fetch game1:", error);
                }
            }
        }
        fetchGame1();
    }, [id]);

    const togglePlayerList = () => {
        setShowPlayerList((prev) => !prev);
    };
    const onEndmatch1 = async () => {
        await startMatch(Number(id), 12, 12, 12, 12, 1, 0);
        window.location.reload();
    };
    const onEndmatch2 = async () => {
        await startMatch(Number(id), 12, 12, 12, 12, 2, 0);
        window.location.reload();
    };
    const onEndmatch3 = async () => {
        await startMatch(Number(id), 12, 12, 12, 12, 3, 0);
        window.location.reload();
    };

    const startGame1 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        const gameId = await createMatch(Number(id), p1, p2, p3, p4, []);
        await startMatch(Number(id), p1, p2, p3, p4, 1, gameId.id);
        await deleteWaitGame(Number(id), point);
        await pushUpWaitGame(Number(id), point);
        window.location.reload();
    };

    const startGame2 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        const gameId = await createMatch(Number(id), p1, p2, p3, p4, []);
        await startMatch(Number(id), p1, p2, p3, p4, 2, gameId.id);
        await deleteWaitGame(Number(id), point);
        await pushUpWaitGame(Number(id), point);
        window.location.reload();
    };

    const startGame3 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        const gameId = await createMatch(Number(id), p1, p2, p3, p4, []);
        await startMatch(Number(id), p1, p2, p3, p4, 3, gameId.id);
        await deleteWaitGame(Number(id), point);
        await pushUpWaitGame(Number(id), point);
        window.location.reload();
    };

    const enterWaitGame = async (playerid: number) => {
        const waitGame: GameBoard = {
            pointer: gamePointer,
            playerid: playerid,
            clubid: Number(id),
        };
        const copys = [...waitGameListId];
        const existingPlayerIndex = copys.findIndex((game) => game.pointer === waitGame.pointer);
        console.log("Existing player index:", existingPlayerIndex);
        if (existingPlayerIndex !== -1) {
            copys[existingPlayerIndex].playerid = waitGame.playerid;
            setWaitGameListId(copys);
            updateWaitGame(playerid, waitGame.pointer);
            const pointer = gamePointer + 1;
            setGamePointer(pointer);
            return;
        }
        copys.push(waitGame);
        setWaitGameListId(copys);
        const pointer = gamePointer + 1;
        setGamePointer(pointer);
        createWaitGame(Number(id), playerid, gamePointer);
        await gameOneUp(playerid);
        window.location.reload();
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
                0,
                point
            );
        } else if (boardPointer == 1) {
            startGame2(
                waitGameListId[point + 0].playerid,
                waitGameListId[point + 1].playerid,
                waitGameListId[point + 2].playerid,
                waitGameListId[point + 3].playerid,
                1,
                point
            );
        } else if (boardPointer == 2) {
            startGame3(
                waitGameListId[point + 0].playerid,
                waitGameListId[point + 1].playerid,
                waitGameListId[point + 2].playerid,
                waitGameListId[point + 3].playerid,
                2,
                point
            );
        }
    };

    return (
        <div className="flex ">
            {/* 좌측 화면 */}
            <div className="flex flex-col w-3/4">
                {/* GameCourt 3 */}
                {/* 상단 3 부분 */}
                <div className=" bg-gray-200 p-0">
                    <div className="flex flex-row justify-between ">
                        <div
                            className={`w-1/3 z-20 ${boardPointer == 0 ? "bg-green-500" : "bg-blue-100"} p-0`}
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
                                court={1}
                                gameid={game1?.gameid ?? 0}
                                onEndMatch={onEndmatch1}
                            />
                        </div>
                        <div
                            className={`w-1/3 z-20 ${boardPointer == 1 ? "bg-green-500" : "bg-blue-100"}`}
                            onClick={() => {
                                setBoardPointer(1);
                            }}
                        >
                            <GameCourt
                                p1={game2?.player1id ?? 12}
                                p2={game2?.player2id ?? 12}
                                p3={game2?.player3id ?? 12}
                                p4={game2?.player4id ?? 12}
                                clubid={Number(id)}
                                court={2}
                                gameid={game2?.gameid ?? 0}
                                onEndMatch={onEndmatch2}
                            />
                        </div>
                        <div
                            className={`w-1/3 z-10 ${boardPointer == 2 ? "bg-green-500" : "bg-blue-100"} p-0`}
                            onClick={() => {
                                setBoardPointer(2);
                            }}
                        >
                            <GameCourt
                                p1={game3?.player1id ?? 12}
                                p2={game3?.player2id ?? 12}
                                p3={game3?.player3id ?? 12}
                                p4={game3?.player4id ?? 12}
                                clubid={Number(id)}
                                court={3}
                                gameid={game3?.gameid ?? 0}
                                onEndMatch={onEndmatch3}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row p-4">
                    {/* 하단 7 부분 */}
                    <div className="flex flex-row w-10 justify-center bg-green-200 ">
                        <div className="flex flex-col mt-1 h-full gap-1 *:flex *:justify-center *:items-center *:text-2xl *:h-16">
                            <div
                                className="bg-red-200"
                                onClick={() => {
                                    if (
                                        (boardPointer == 0 && game1?.player1id !== 12) ||
                                        (boardPointer == 1 && game2?.player1id !== 12) ||
                                        (boardPointer == 2 && game3?.player1id !== 12)
                                    ) {
                                        alert("코트가 비어있지 않습니다.");
                                    } else {
                                        inputGame(0, boardPointer);
                                    }
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
                        {Array.from({ length: 40 }, (_, index) => (
                            <div
                                key={"game" + index}
                                className={`h-16 ${gamePointer == index ? "bg-red-200" : "bg-blue-200"}`}
                                onClick={async () => {
                                    await setGamePointer(index);
                                    console.log(gamePointer);
                                }}
                            >
                                {waitGameListId.map((game) => {
                                    return game.pointer == index ? (
                                        <FromIdtoPlayerCard
                                            key={game.playerid}
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
                                <div key={playerid} className="z-1">
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
                {/* test button */}
                {/* <button
                    className="bg-blue-500 text-white rounded-xl w-32 h-12 flex items-center justify-center shadow-lg mt-4"
                    onClick={() => {
                        deleteWaitGame(Number(id), 0);
                    }}
                >
                    Test
                </button> */}
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
                    className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                    onClick={togglePlayerList}
                >
                    <span className="text-3xl">+</span>
                </button>
            </div>
            {showPlayerList && (
                <div className="fixed top-0 z-50 right-0 w-full bg-black bg-opacity-50 flex flex-wrap items-center justify-center">
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
