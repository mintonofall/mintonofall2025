"use client";

import { useState, useEffect } from "react";
import WaitPlayerList from "@/app/component/WaitPlayerList";
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
    exitPlayer,
} from "@/lib/getUserGoHome";
import { Player } from "@/lib/interface";
import getPlayerList from "@/lib/getPlayerList";
import PlayerCard from "@/app/component/PlayerCard";
import { Play } from "next/font/google";
import { get } from "http";
interface WaitGameListCLass {
    point: number;
    clubid: number;
    playerid: number;
}

interface WaitPlayerListCLass {
    id: number | null;
    clubid: number;
    Playerid: number;
    enterDate: Date;
    exitDate: Date | null;
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

export default function GameBoard({ params }: { params: Promise<{ id: string }> }) {
    const [showPlayerList, setShowPlayerList] = useState(false);
    const [id, setId] = useState<string | null>(null);
    const [waitPlayerList, setWaitPlayerList] = useState<WaitPlayerListCLass[]>([]);
    const [gamePointer, setGamePointer] = useState<number>(0);
    const [waitGameListId, setWaitGameListId] = useState<WaitGameListCLass[]>([]);
    const [boardPointer, setBoardPointer] = useState<number>(0);
    const [game1, setGame1] = useState<PlayingGameBoard>();
    const [game2, setGame2] = useState<PlayingGameBoard>();
    const [game3, setGame3] = useState<PlayingGameBoard>();
    const [playerList, setPlayerList] = useState<Player[]>([]);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).id;
            setId(resolvedParams);
        }
        fetchParams();
    }, [params]);
    useEffect(() => {
        async function fetchPlayerList() {
            const playerListData = await getPlayerList(Number(id));
            setPlayerList(playerListData);
            const waitPlayerListData = await getWaitPlayerList(Number(id));
            setWaitPlayerList(waitPlayerListData);
            const waitGameListData = await getWaitGames(Number(id));
            setWaitGameListId(waitGameListData);
            if (id) {
                const getMatchData = await getMatch(Number(id));
                console.log("getMatchData : ", getMatchData);
                setGame1({
                    id: getMatchData[0].id,
                    gameid: getMatchData[0].gameid || null,
                    court: getMatchData[0].CourtNumber,
                    clubid: getMatchData[0].clubid,
                    player1id: getMatchData[0].player1id,
                    player2id: getMatchData[0].player2id,
                    player3id: getMatchData[0].player3id,
                    player4id: getMatchData[0].player4id,
                });
                setGame2({
                    id: getMatchData[1].id,
                    gameid: getMatchData[1].gameid || null,
                    court: getMatchData[1].CourtNumber,
                    clubid: getMatchData[1].clubid,
                    player1id: getMatchData[1].player1id,
                    player2id: getMatchData[1].player2id,
                    player3id: getMatchData[1].player3id,
                    player4id: getMatchData[1].player4id,
                });
                setGame3({
                    id: getMatchData[2].id,
                    gameid: getMatchData[2].gameid || null,
                    court: getMatchData[2].CourtNumber,
                    clubid: getMatchData[2].clubid,
                    player1id: getMatchData[2].player1id,
                    player2id: getMatchData[2].player2id,
                    player3id: getMatchData[2].player3id,
                    player4id: getMatchData[2].player4id,
                });
            }
        }
        fetchPlayerList();
        console.log("waitPl : ", waitPlayerList);
    }, [id]);

    useEffect(() => {
        console.log("playerlist : ", playerList);
    }, [playerList]);
    useEffect(() => {
        console.log("waitPlayerList : ", waitPlayerList);
    }, [waitPlayerList]);

    useEffect(() => {
        console.log("waitGameListId : ", waitGameListId);
        function nextPointer() {
            const points = waitGameListId.map((game) => game.point);
            let nextPoint = 0;
            while (points.includes(nextPoint)) {
                nextPoint++;
            }
            setGamePointer(nextPoint);
        }
        nextPointer();
    }, [waitGameListId]);

    const togglePlayerList = () => {
        setShowPlayerList((prev) => !prev);
    };
    const onEndmatch1 = async () => {
        setGame1({
            court: 1,
            gameid: null,
            clubid: Number(id),
            player1id: 12,
            player2id: 12,
            player3id: 12,
            player4id: 12,
        });
        await startMatch(Number(id), 12, 12, 12, 12, 1, 0);
    };
    const onEndmatch2 = async () => {
        setGame1({
            court: 2,
            gameid: null,
            clubid: Number(id),
            player1id: 12,
            player2id: 12,
            player3id: 12,
            player4id: 12,
        });
        await startMatch(Number(id), 12, 12, 12, 12, 2, 0);
    };
    const onEndmatch3 = async () => {
        setGame1({
            court: 3,
            gameid: null,
            clubid: Number(id),
            player1id: 12,
            player2id: 12,
            player3id: 12,
            player4id: 12,
        });
        await startMatch(Number(id), 12, 12, 12, 12, 3, 0);
    };

    const startGame1 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        const gameId = await createMatch(Number(id), p1, p2, p3, p4, []);
        setGame1({
            id: gameId.id,
            gameid: gameId.id,
            court: court,
            clubid: gameId.clubid,
            player1id: gameId.player1id,
            player2id: gameId.player2id,
            player3id: gameId.player3id,
            player4id: gameId.player4id,
        });

        await startMatch(Number(id), p1, p2, p3, p4, 1, gameId.id);
        const filteredWaitGameListId = waitGameListId.filter(
            (game) => ![point + 0, point + 1, point + 2, point + 3].includes(game.point)
        );
        setWaitGameListId(filteredWaitGameListId);
        await deleteWaitGame(Number(id), point);
        const updatedWaitGameListId = waitGameListId.map((game) => {
            if (game.point >= point + 4) {
                return { ...game, point: game.point - 4 };
            }
            return game;
        });
        setWaitGameListId(updatedWaitGameListId);
        await pushUpWaitGame(Number(id), point);
    };

    const startGame2 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        const gameId = await createMatch(Number(id), p1, p2, p3, p4, []);
        setGame2({
            id: gameId.id,
            gameid: gameId.id,
            court: court,
            clubid: gameId.clubid,
            player1id: gameId.player1id,
            player2id: gameId.player2id,
            player3id: gameId.player3id,
            player4id: gameId.player4id,
        });
        await startMatch(Number(id), p1, p2, p3, p4, 2, gameId.id);
        const filteredWaitGameListId = waitGameListId.filter(
            (game) => ![point + 0, point + 1, point + 2, point + 3].includes(game.point)
        );
        setWaitGameListId(filteredWaitGameListId);
        await deleteWaitGame(Number(id), point);
        const updatedWaitGameListId = waitGameListId.map((game) => {
            setWaitGameListId(updatedWaitGameListId);
            if (game.point >= point + 4) {
                return { ...game, point: game.point - 4 };
            }
            return game;
        });
        await pushUpWaitGame(Number(id), point);
    };

    const startGame3 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        const gameId = await createMatch(Number(id), p1, p2, p3, p4, []);
        await startMatch(Number(id), p1, p2, p3, p4, 3, gameId.id);
        const filteredWaitGameListId = waitGameListId.filter(
            (game) => ![point + 0, point + 1, point + 2, point + 3].includes(game.point)
        );
        setWaitGameListId(filteredWaitGameListId);
        const updatedWaitGameListId = waitGameListId.map((game) => {
            setWaitGameListId(updatedWaitGameListId);
            if (game.point >= point + 4) {
                return { ...game, point: game.point - 4 };
            }
            return game;
        });
        await deleteWaitGame(Number(id), point);
        await pushUpWaitGame(Number(id), point);
    };

    /**
     * 플레이어를 대기 게임 목록에 추가하는 과정을 처리합니다.
     *
     * @param {number} playerid - 대기 게임에 들어가는 플레이어의 ID입니다.
     *
     * 이 함수는 다음 단계를 수행합니다:
     * 1. 플레이어의 정보와 현재 게임 포인터를 사용하여 `waitGame` 객체를 생성합니다.
     * 2. 플레이어가 이미 대기 게임 목록에 있는지 확인합니다.
     * 3. 플레이어가 존재하면 목록에서 플레이어의 ID를 업데이트하고 게임 포인터를 증가시킵니다.
     * 4. 플레이어가 존재하지 않으면 플레이어를 대기 게임 목록에 추가하고, 게임 포인터를 증가시키며,
     *    새로운 대기 게임 항목을 생성하고 `gameOneUp`을 호출하여 게임 상태를 업데이트합니다.
     *
     * @returns {Promise<void>} 플레이어가 대기 게임 목록에 성공적으로 추가되면 해결되는 약속을 반환합니다.
     */
    const enterWaitGame = (playerid: number) => {
        const waitGame: WaitGameListCLass = {
            point: gamePointer,
            playerid,
            clubid: Number(id),
        };
        const copys = [...waitGameListId];

        const existingPlayerIndex = copys.findIndex((game) => game.point === waitGame.point);
        const playerIndex = playerList.findIndex((player) => player.id === playerid);

        console.log("Existing point index:", existingPlayerIndex);
        // 플레이어가 이미 대기 게임 목록에 있는지 확인합니다.
        if (existingPlayerIndex !== -1) {
            copys[existingPlayerIndex].playerid = waitGame.playerid;
            // 대기 게임 목록에서 플레이어 ID를 업데이트하고 게임 포인터를 증가시킵니다.
            setWaitGameListId(copys);
            updateWaitGame(playerid, waitGame.point);
            //PlayerList 에서 게임횟수를 1 증가시킨다.
            if (playerIndex !== -1) {
            }
            const sortedWaitPlayerList = [...waitPlayerList].sort((a, b) => {
                const playerA = playerList.find((player) => player.id === a.Playerid);
                const playerB = playerList.find((player) => player.id === b.Playerid);
                return (playerA?.games || 0) - (playerB?.games || 0);
            });
            setWaitPlayerList(sortedWaitPlayerList);
            const resule = gameOneUp(playerid);
            console.log("gameOneUp : ", resule);
            return;
        }
        copys.push(waitGame);
        setWaitGameListId(copys);
        const pointer = gamePointer + 1;
        setGamePointer(pointer);
        createWaitGame(Number(id), playerid, gamePointer);
        console.log(`Player index: ${playerIndex}`);
        const updatedPlayer = {
            ...playerList[playerIndex],
            games: playerList[playerIndex].games + 1,
            gameDatas: [...playerList[playerIndex].gameDatas, new Date()],
        };
        console.log(`Updated player: ${JSON.stringify(updatedPlayer)}`);
        const updatedPlayerList = [...playerList];
        updatedPlayerList[playerIndex] = updatedPlayer;
        setPlayerList(updatedPlayerList);
        const resule = gameOneUp(playerid);
        console.log("gameOneUp : ", resule);
    };

    const closePlayerList = () => {
        setShowPlayerList(false);
    };

    const handleExitPlayer = (playerId: number) => {
        exitPlayer(playerId, Number(id));
    };

    const enterPlayer = (playerId: number) => {
        console.log(playerId);
        const copyWaitPlayerList = [...waitPlayerList];
        const existingPlayerIndex = copyWaitPlayerList.findIndex((player) => player.id === playerId);
        if (existingPlayerIndex !== -1) {
            return;
        }
        const player: WaitPlayerListCLass = {
            clubid: Number(id),
            enterDate: new Date(),
            exitDate: null,
            Playerid: playerId,
            id: null,
        };
        if (!player) {
            return;
        }
        copyWaitPlayerList.unshift(player);
        setWaitPlayerList(copyWaitPlayerList);
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
                        {Array.from({ length: 32 }, (_, index) => (
                            <div
                                key={"game" + index}
                                className={`h-16 ${gamePointer == index ? "bg-red-200" : "bg-blue-200"}`}
                                onClick={async () => {
                                    setGamePointer(index);
                                    console.log(gamePointer);
                                }}
                            >
                                {waitGameListId.map((game) => {
                                    if (game.point == index) {
                                        const player: Player | undefined = playerList.find(
                                            (player) => player.id === game.playerid
                                        );
                                        if (player) {
                                            if (player) {
                                                return <PlayerCard key={game.playerid} {...player} />;
                                            }
                                            return null;
                                        }
                                    }
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* 우측 화면 */}
            <div className="w-1/4 bg-gray-400 p-4">
                <div>
                    {waitPlayerList.map((waitPlayer, index) => {
                        const playerData: Player | undefined = playerList.find(
                            (player) => player.id === waitPlayer.Playerid
                        );
                        return (
                            <div key={playerData!.id} className="flex flex-col">
                                <div
                                    className="flex flex-col"
                                    onClick={() => {
                                        enterWaitGame(playerData!.id);
                                    }}
                                >
                                    <div key={playerData!.id} className="flex flex-col z-1">
                                        {playerData && <PlayerCard {...playerData} />}
                                    </div>
                                </div>
                                <button
                                    className="absolute right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                                    onClick={() => {
                                        const data = [...waitPlayerList];
                                        const playerid = data[index].Playerid;
                                        data.splice(index, 1);
                                        setWaitPlayerList(data);
                                        handleExitPlayer(playerid);
                                    }}
                                >
                                    <span className="text-xs">×</span>
                                </button>
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
                        clubid={Number(id)}
                    />
                </div>
            )}
        </div>
    );
}
