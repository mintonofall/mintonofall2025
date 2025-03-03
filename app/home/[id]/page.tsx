"use client";

import { useState, useEffect } from "react";
import WaitPlayerList from "@/app/component/WaitPlayerList";
import GameCourt from "@/app/component/GameCourt";
import {
    getWaitGames,
    getWaitPlayerList,
    pushWaitPlayerList,
    startMatch,
    getMatch,
    createMatch,
    gameOneUp,
    exitPlayer,
    getClub,
    resetWaitGames,
    sendMessage,
    oneGameDown,
} from "@/lib/getUserGoHome";
import { Player, WaitGameListCLass } from "@/lib/interface";
import getPlayerList from "@/lib/getPlayerList";
import PlayerCard from "@/app/component/PlayerCard";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
// import { makePlayer } from "@/lib/makePlayer";

interface WaitPlayerListCLass {
    id: number | null;
    clubid: number;
    Playerid: number;
    enterDate: Date;
    exitDate: Date | null;
}

interface PlayingGameBoard {
    id?: number;
    gameid: string | null;
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
    const [game4, setGame4] = useState<PlayingGameBoard>();
    const [playerList, setPlayerList] = useState<Player[]>([]);
    const [howManyCourts, setHowManyCourts] = useState<number>(3);
    const [howSort, setHowSort] = useState("games");
    const [showEdit, setShowEdit] = useState(false);
    // const point: number = 0;

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).id;
            setId(resolvedParams);
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        console.log("Effectgame1 : ", game1);
        async function startGame1Handle() {
            if (game1?.player1id !== 12) {
                if (
                    game1?.gameid &&
                    game1?.player1id &&
                    game1?.player2id &&
                    game1.player3id &&
                    game1.player4id !== undefined
                ) {
                    const gameId = await createMatch(
                        game1.gameid,
                        game1.clubid!,
                        game1.player1id,
                        game1.player2id,
                        game1.player3id,
                        game1.player4id,
                        []
                    );
                    await startMatch(
                        Number(id),
                        game1.player1id,
                        game1.player2id,
                        game1.player3id,
                        game1.player4id,
                        1,
                        gameId.gameid
                    );
                }
            }
        }
        startGame1Handle();
        sendMessage("gameboards");
    }, [game1, id]);

    useEffect(() => {
        console.log("Effectgame2 : ", game2);
        async function startGame2Handle() {
            if (game2?.player1id !== 12) {
                if (
                    game2?.gameid &&
                    game2?.player1id &&
                    game2?.player2id &&
                    game2.player3id &&
                    game2.player4id !== undefined
                ) {
                    const gameId = await createMatch(
                        game2.gameid,
                        game2.clubid!,
                        game2.player1id,
                        game2.player2id,
                        game2.player3id,
                        game2.player4id,
                        []
                    );
                    await startMatch(
                        Number(id),
                        game2.player1id,
                        game2.player2id,
                        game2.player3id,
                        game2.player4id,
                        2,
                        gameId.gameid
                    );
                }
            }
        }

        startGame2Handle();
        sendMessage("gameboards");
    }, [game2, id]);

    useEffect(() => {
        console.log("Effectgame3 : ", game3);
        async function startGame3Handle() {
            if (game3?.player1id !== 12) {
                if (
                    game3?.gameid &&
                    game3?.player1id &&
                    game3?.player2id &&
                    game3.player3id &&
                    game3.player4id !== undefined
                ) {
                    const gameId = await createMatch(
                        game3.gameid,
                        game3.clubid!,
                        game3.player1id,
                        game3.player2id,
                        game3.player3id,
                        game3.player4id,
                        []
                    );
                    await startMatch(
                        Number(id),
                        game3.player1id,
                        game3.player2id,
                        game3.player3id,
                        game3.player4id,
                        3,
                        gameId.gameid
                    );
                }
            }
        }

        startGame3Handle();
        sendMessage("gameboards");
    }, [game3, id]);
    useEffect(() => {
        console.log("Effectgame4 : ", game4);
        async function startGame4Handle() {
            if (game4?.player1id !== 12) {
                if (
                    game4?.gameid &&
                    game4?.player1id &&
                    game4?.player2id &&
                    game4.player3id &&
                    game4.player4id !== undefined
                ) {
                    const gameId = await createMatch(
                        game4.gameid,
                        game4.clubid!,
                        game4.player1id,
                        game4.player2id,
                        game4.player3id,
                        game4.player4id,
                        []
                    );
                    await startMatch(
                        Number(id),
                        game4.player1id,
                        game4.player2id,
                        game4.player3id,
                        game4.player4id,
                        4,
                        gameId.gameid
                    );
                }
            }
        }
        startGame4Handle();
        sendMessage("gameboards");
    }, [game4, id]);

    async function resetPlayer(id: number) {
        const resetPlayer = await getPlayerList(id);
        const resetWaitPlayer = await getWaitPlayerList(id);
        console.log("resetPlayer : ", resetPlayer);
        console.log("resetWaitPlayer : ", resetWaitPlayer);
        setPlayerList(resetPlayer);
        setWaitPlayerList(resetWaitPlayer);
    }

    useEffect(() => {
        async function fetchPlayerList() {
            const [playerListData, getClubdata, waitPlayerListData, waitGameListData] = await Promise.all([
                getPlayerList(Number(id)),
                getClub(Number(id)),
                getWaitPlayerList(Number(id)),
                getWaitGames(Number(id)),
            ]);
            setPlayerList(playerListData);
            if (getClubdata) {
                setHowManyCourts(getClubdata.howManyCourts);
            }
            console.log("howManyCourts : ", howManyCourts);
            setWaitPlayerList(waitPlayerListData);
            setWaitGameListId(waitGameListData);
            if (id) {
                const getMatchData = await getMatch(Number(id));
                console.log("getMatchData : ", getMatchData);
                if (getMatchData[0]) {
                    setGame1({
                        id: 1,
                        gameid: getMatchData[0].gameid || null,
                        court: getMatchData[0].CourtNumber,
                        clubid: getMatchData[0].clubid,
                        player1id: getMatchData[0].player1id,
                        player2id: getMatchData[0].player2id,
                        player3id: getMatchData[0].player3id,
                        player4id: getMatchData[0].player4id,
                    });
                }
                if (getMatchData[1]) {
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
                }
                if (getMatchData[2]) {
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
                if (getMatchData[3]) {
                    setGame4({
                        id: getMatchData[3].id,
                        gameid: getMatchData[3].gameid || null,
                        court: getMatchData[3].CourtNumber,
                        clubid: getMatchData[3].clubid,
                        player1id: getMatchData[3].player1id,
                        player2id: getMatchData[3].player2id,
                        player3id: getMatchData[3].player3id,
                        player4id: getMatchData[3].player4id,
                    });
                }
            }
        }
        fetchPlayerList();
        sortWaitPlayerByGames();
    }, [id]);

    useEffect(() => {
        console.log("playerlist : ", playerList);
        if (howSort == "games") {
            sortWaitPlayerByGames();
        }
        if (howSort == "name") {
            sortWaitPlayerByNames();
        }
    }, [playerList]);

    useEffect(() => {
        console.log("waitGameListId : ", waitGameListId);
        async function resetDB() {
            await resetWaitGames(Number(id), waitGameListId);
        }
        function nextPointer() {
            const points = waitGameListId.map((game) => game.point);
            let nextPoint = 0;
            while (points.includes(nextPoint)) {
                nextPoint++;
            }
            setGamePointer(nextPoint);
        }

        nextPointer();
        const result = resetDB();
        if (howSort == "games") {
            sortWaitPlayerByGames();
        }
        if (howSort == "name") {
            sortWaitPlayerByNames();
        }
        console.log("resetDB : ", result);
    }, [waitGameListId]);

    // const clearPlayerGames = async (clubid: number) => {
    //     await clearPlayerGamesDb(clubid);
    // };
    const sortWaitPlayerByGames = () => {
        const waitGroupNoGames = waitPlayerList.filter((player) => {
            if (howManyGame(player.Playerid) == 0) {
                return player;
            }
        });

        const waitGroupOneGames = waitPlayerList.filter((player) => {
            if (howManyGame(player.Playerid) >= 1) {
                return player;
            }
        });
        waitGroupNoGames.sort((a, b) => {
            const playerA = playerList.find((player) => player.id === a.Playerid);
            const playerB = playerList.find((player) => player.id === b.Playerid);
            return (playerA?.games || 0) - (playerB?.games || 0);
        });
        waitGroupOneGames.sort((a, b) => {
            const playerA = playerList.find((player) => player.id === a.Playerid);
            const playerB = playerList.find((player) => player.id === b.Playerid);
            return (playerA?.games || 0) - (playerB?.games || 0);
        });
        const sumGroup = [...waitGroupNoGames, ...waitGroupOneGames];
        setWaitPlayerList(sumGroup);
    };

    const sortWaitPlayerByNames = () => {
        const waitGroupNoGames = waitPlayerList.filter((player) => {
            if (howManyGame(player.Playerid) == 0) {
                return player;
            }
        });

        const waitGroupOneGames = waitPlayerList.filter((player) => {
            if (howManyGame(player.Playerid) >= 1) {
                return player;
            }
        });
        waitGroupNoGames.sort((a, b) => {
            const playerA = playerList.find((player) => player.id === a.Playerid);
            const playerB = playerList.find((player) => player.id === b.Playerid);
            return (playerA?.name || "").localeCompare(playerB?.name || "");
        });
        waitGroupOneGames.sort((a, b) => {
            const playerA = playerList.find((player) => player.id === a.Playerid);
            const playerB = playerList.find((player) => player.id === b.Playerid);
            return (playerA?.name || "").localeCompare(playerB?.name || "");
        });
        setWaitPlayerList([...waitGroupNoGames, ...waitGroupOneGames]);
    };

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
        await startMatch(Number(id), 12, 12, 12, 12, 1, "0");
    };
    const onEndmatch2 = async () => {
        setGame2({
            court: 2,
            gameid: null,
            clubid: Number(id),
            player1id: 12,
            player2id: 12,
            player3id: 12,
            player4id: 12,
        });
        await startMatch(Number(id), 12, 12, 12, 12, 2, "0");
    };
    const onEndmatch3 = async () => {
        setGame3({
            court: 3,
            gameid: null,
            clubid: Number(id),
            player1id: 12,
            player2id: 12,
            player3id: 12,
            player4id: 12,
        });
        await startMatch(Number(id), 12, 12, 12, 12, 3, "0");
    };
    const onEndmatch4 = async () => {
        setGame4({
            court: 4,
            gameid: null,
            clubid: Number(id),
            player1id: 12,
            player2id: 12,
            player3id: 12,
            player4id: 12,
        });
        await startMatch(Number(id), 12, 12, 12, 12, 4, "0");
    };

    const startGame1 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        setGame1({
            gameid: crypto.randomUUID(),
            court: court,
            clubid: Number(id),
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
        });

        // 선택된 4명을 배열에서 제외한다
        const filteredWaitGameListId = waitGameListId.filter(
            (game) => ![point + 0, point + 1, point + 2, point + 3].includes(game.point)
        );
        console.log("filteredWaitGameListId : ", filteredWaitGameListId);
        //밑에서부터 대기열을 올린다.
        const updatedWaitGameListId = filteredWaitGameListId.map((game) => {
            if (game.point >= point + 4) {
                return { ...game, point: game.point - 4 };
            }
            return game;
        });
        setWaitGameListId(updatedWaitGameListId);
    };

    const startGame2 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        setGame2({
            gameid: crypto.randomUUID(),
            court: court,
            clubid: Number(id),
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
        });
        const filteredWaitGameListId = waitGameListId.filter(
            (game) => ![point + 0, point + 1, point + 2, point + 3].includes(game.point)
        );
        const updatedWaitGameListId = filteredWaitGameListId.map((game) => {
            if (game.point >= point + 4) {
                return { ...game, point: game.point - 4 };
            }
            return game;
        });
        setWaitGameListId(updatedWaitGameListId);
    };

    const startGame3 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        setGame3({
            gameid: crypto.randomUUID(),
            court: court,
            clubid: Number(id),
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
        });
        const filteredWaitGameListId = waitGameListId.filter(
            (game) => ![point + 0, point + 1, point + 2, point + 3].includes(game.point)
        );
        const updatedWaitGameListId = filteredWaitGameListId.map((game) => {
            if (game.point >= point + 4) {
                return { ...game, point: game.point - 4 };
            }
            return game;
        });
        setWaitGameListId(updatedWaitGameListId);
    };
    const startGame4 = async (p1: number, p2: number, p3: number, p4: number, court: number, point: number) => {
        setGame4({
            gameid: crypto.randomUUID(),
            court: court,
            clubid: Number(id),
            player1id: p1,
            player2id: p2,
            player3id: p3,
            player4id: p4,
        });
        const filteredWaitGameListId = waitGameListId.filter(
            (game) => ![point + 0, point + 1, point + 2, point + 3].includes(game.point)
        );
        const updatedWaitGameListId = filteredWaitGameListId.map((game) => {
            if (game.point >= point + 4) {
                return { ...game, point: game.point - 4 };
            }
            return game;
        });
        setWaitGameListId(updatedWaitGameListId);
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
        // 대기 게임 목록에 플레이어가 있는지 확인합니다.
        if (existingPlayerIndex !== -1) {
            const downGamePlayerId = copys[existingPlayerIndex].playerid;
            const dawnGamePlayerIndex = playerList.findIndex((player) => player.id === downGamePlayerId);
            const copyPlayerList = [...playerList];
            copyPlayerList[dawnGamePlayerIndex].games = copyPlayerList[dawnGamePlayerIndex].games - 1;
            setPlayerList(copyPlayerList);

            copys[existingPlayerIndex].playerid = waitGame.playerid;

            setWaitGameListId(copys);
            //PlayerList 에서 게임횟수를 1 증가시킨다.
        } else {
            copys.push(waitGame);
            setWaitGameListId(copys);
            // 대기 게임 목록에서 플레이어 ID를 업데이트하고 게임 포인터를 증가시킵니다.
            const pointer = gamePointer + 1;
            setGamePointer(pointer);
        }

        // const sortedWaitPlayerList = [...waitPlayerList].sort((a, b) => {
        //     const playerA = playerList.find((player) => player.id === a.Playerid);
        //     const playerB = playerList.find((player) => player.id === b.Playerid);
        //     return (playerA?.games || 0) - (playerB?.games || 0);
        // });
        // setWaitPlayerList(sortedWaitPlayerList);
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
        return;
    };

    const closePlayerList = () => {
        setShowPlayerList(false);
    };

    const handleExitPlayer = (playerId: number) => {
        exitPlayer(playerId, Number(id));
    };

    const handleOnWinsUp = (playerId: number[]): number[] => {
        if (playerId.length !== 2) {
            return [];
        }
        const playerIndex1 = playerList.findIndex((player) => player.id === playerId[0]);
        const playerIndex2 = playerList.findIndex((player) => player.id === playerId[1]);
        const updatedPlayer = {
            ...playerList[playerIndex1],
            wins: playerList[playerIndex1].win + 1,
        };
        const updatedPlayer2 = {
            ...playerList[playerIndex2],
            wins: playerList[playerIndex2].win + 1,
        };
        const updatedPlayerList = [...playerList];
        updatedPlayerList[playerIndex1] = updatedPlayer;
        updatedPlayerList[playerIndex2] = updatedPlayer2;
        setPlayerList(updatedPlayerList);
        return [updatedPlayer.id, updatedPlayer2.id];
    };

    const enterPlayer = (playerId: number) => {
        console.log(playerId);
        const copyWaitPlayerList = [...waitPlayerList];
        const existingPlayerIndex = copyWaitPlayerList.findIndex((player) => player.Playerid === playerId);
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
        if (
            waitGameListId[waitGameListId.findIndex((game) => game.point === point)] === undefined ||
            waitGameListId[waitGameListId.findIndex((game) => game.point === point + 1)] === undefined ||
            waitGameListId[waitGameListId.findIndex((game) => game.point === point + 2)] === undefined ||
            waitGameListId[waitGameListId.findIndex((game) => game.point === point + 3)] === undefined
        ) {
            alert("4명의 플레이어를 선택해주세요.");
            return;
        }
        if (boardPointer == 0) {
            startGame1(
                waitGameListId[waitGameListId.findIndex((game) => game.point === point)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 1)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 2)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 3)].playerid,
                0,
                point
            );
        } else if (boardPointer == 1) {
            startGame2(
                waitGameListId[waitGameListId.findIndex((game) => game.point === point)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 1)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 2)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 3)].playerid,
                1,
                point
            );
        } else if (boardPointer == 2) {
            startGame3(
                waitGameListId[waitGameListId.findIndex((game) => game.point === point)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 1)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 2)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 3)].playerid,
                2,
                point
            );
        } else if (boardPointer == 3) {
            startGame4(
                waitGameListId[waitGameListId.findIndex((game) => game.point === point)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 1)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 2)].playerid,
                waitGameListId[waitGameListId.findIndex((game) => game.point === point + 3)].playerid,
                3,
                point
            );
        }
    };

    const howManyGame = (playerId: number) => {
        const howMany1 = waitGameListId.filter((game) => game.playerid === playerId).length;
        const houmanyInGameboard = [game1, game2, game3, game4].filter((game) => {
            if (game?.player1id === playerId || game?.player2id === playerId || game?.player3id === playerId) {
                return game;
            }
        }).length;
        const howMany = howMany1 + houmanyInGameboard;
        return howMany;
    };

    return (
        <div className="flex max-h-screen ">
            {/* 좌측 화면 */}
            <div className="flex flex-col w-3/4">
                {/* GameCourt 3 */}
                {/* 상단 3 부분 */}
                <div className=" bg-gray-200 p-0">
                    <div className="flex flex-row *:flex-auto">
                        <div
                            className={`w-1/2 flex-auto z-20 ${boardPointer == 0 ? "bg-green-500" : "bg-blue-100"} p-0`}
                            onClick={() => {
                                setBoardPointer(0);
                            }}
                        >
                            <GameCourt
                                p1={
                                    playerList.find((pl) => pl.id == game1?.player1id) ??
                                    playerList.find((pl) => pl.id == 12)!
                                }
                                p2={
                                    playerList.find((pl) => pl.id == game1?.player2id) ??
                                    playerList.find((pl) => pl.id == 12)!
                                }
                                p3={
                                    playerList.find((pl) => pl.id == game1?.player3id) ??
                                    playerList.find((pl) => pl.id == 12)!
                                }
                                p4={
                                    playerList.find((pl) => pl.id == game1?.player4id) ??
                                    playerList.find((pl) => pl.id == 12)!
                                }
                                clubid={Number(id)}
                                court={1}
                                gameid={game1?.gameid ?? "0"}
                                onEndMatch={onEndmatch1}
                                onWinsUp={handleOnWinsUp}
                            />
                        </div>
                        <div
                            className={`w-1/2 z-20 ${boardPointer == 1 ? "bg-green-500" : "bg-blue-100"}`}
                            onClick={() => {
                                setBoardPointer(1);
                            }}
                        >
                            <GameCourt
                                p1={
                                    playerList.filter((pl) => pl.id == game2?.player1id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p2={
                                    playerList.filter((pl) => pl.id == game2?.player2id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p3={
                                    playerList.filter((pl) => pl.id == game2?.player3id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p4={
                                    playerList.filter((pl) => pl.id == game2?.player4id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                clubid={Number(id)}
                                court={2}
                                gameid={game2?.gameid ?? "0"}
                                onEndMatch={onEndmatch2}
                                onWinsUp={handleOnWinsUp}
                            />
                        </div>
                        <div
                            className={`w-1/2 z-10 ${boardPointer == 2 ? "bg-green-500" : "bg-blue-100"} p-0`}
                            onClick={() => {
                                setBoardPointer(2);
                            }}
                        >
                            <GameCourt
                                p1={
                                    playerList.filter((pl) => pl.id == game3?.player1id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p2={
                                    playerList.filter((pl) => pl.id == game3?.player2id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p3={
                                    playerList.filter((pl) => pl.id == game3?.player3id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p4={
                                    playerList.filter((pl) => pl.id == game3?.player4id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                clubid={Number(id)}
                                court={3}
                                gameid={game3?.gameid ?? "0"}
                                onEndMatch={onEndmatch3}
                                onWinsUp={handleOnWinsUp}
                            />
                        </div>
                        <div
                            className={`${howManyCourts == 3 ? "hidden" : ""} w-1/2 z-10 ${
                                boardPointer == 3 ? "bg-green-500" : "bg-blue-100"
                            } p-0`}
                            onClick={() => {
                                setBoardPointer(3);
                            }}
                        >
                            <GameCourt
                                p1={
                                    playerList.filter((pl) => pl.id == game4?.player1id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p2={
                                    playerList.filter((pl) => pl.id == game4?.player2id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p3={
                                    playerList.filter((pl) => pl.id == game4?.player3id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                p4={
                                    playerList.filter((pl) => pl.id == game4?.player4id)[0] ??
                                    playerList.filter((p) => p.id == 12)
                                }
                                clubid={Number(id)}
                                court={4}
                                gameid={game4?.gameid ?? "0"}
                                onEndMatch={onEndmatch4}
                                onWinsUp={handleOnWinsUp}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row p-4">
                    {/* 하단 7 부분 */}
                    <div className="flex flex-row w-12 justify-center bg-green-200 ">
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
                                <div>
                                    <span className="flex text-base">게임</span>
                                    <span className="flex text-base">시작</span>
                                </div>
                            </div>
                            <div
                                className="bg-blue-200"
                                onClick={() => {
                                    if (
                                        (boardPointer == 0 && game1?.player1id !== 12) ||
                                        (boardPointer == 1 && game2?.player1id !== 12) ||
                                        (boardPointer == 2 && game3?.player1id !== 12)
                                    ) {
                                        alert("코트가 비어있지 않습니다.");
                                    } else {
                                        inputGame(4, boardPointer);
                                    }
                                }}
                            >
                                <div>
                                    <span className="flex text-base">게임</span>
                                    <span className="flex text-base">시작</span>
                                </div>
                            </div>
                            <div
                                className="bg-yellow-200"
                                onClick={() => {
                                    if (
                                        (boardPointer == 0 && game1?.player1id !== 12) ||
                                        (boardPointer == 1 && game2?.player1id !== 12) ||
                                        (boardPointer == 2 && game3?.player1id !== 12)
                                    ) {
                                        alert("코트가 비어있지 않습니다.");
                                    } else {
                                        inputGame(8, boardPointer);
                                    }
                                }}
                            >
                                <div>
                                    <span className="flex text-base">게임</span>
                                    <span className="flex text-base">시작</span>
                                </div>
                            </div>
                            <div
                                className="bg-purple-200"
                                onClick={() => {
                                    if (
                                        (boardPointer == 0 && game1?.player1id !== 12) ||
                                        (boardPointer == 1 && game2?.player1id !== 12) ||
                                        (boardPointer == 2 && game3?.player1id !== 12)
                                    ) {
                                        alert("코트가 비어있지 않습니다.");
                                    } else {
                                        inputGame(12, boardPointer);
                                    }
                                }}
                            >
                                <div>
                                    <span className="flex text-base">게임</span>
                                    <span className="flex text-base">시작</span>
                                </div>
                            </div>
                            <div
                                className="bg-pink-200"
                                onClick={() => {
                                    if (
                                        (boardPointer == 0 && game1?.player1id !== 12) ||
                                        (boardPointer == 1 && game2?.player1id !== 12) ||
                                        (boardPointer == 2 && game3?.player1id !== 12)
                                    ) {
                                        alert("코트가 비어있지 않습니다.");
                                    } else {
                                        inputGame(16, boardPointer);
                                    }
                                }}
                            >
                                <div>
                                    <span className="flex text-base">게임</span>
                                    <span className="flex text-base">시작</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow grid grid-cols-4 gap-1">
                        {Array.from({ length: 32 }, (_, index) => (
                            <div
                                key={"game" + index}
                                className={`h-16 ${gamePointer == index ? "bg-red-200" : "bg-blue-200"}`}
                                onClick={async () => {
                                    console.log("before : ", waitGameListId);
                                    const playerIndex = waitGameListId.findIndex((player) => player.point === index);
                                    console.log("playerIndex : ", playerIndex);
                                    if (playerIndex !== -1) {
                                        const copyPlayer = [...playerList];
                                        const copyPlayerIndex = copyPlayer.findIndex(
                                            (player) => player.id === waitGameListId[playerIndex].playerid
                                        );
                                        oneGameDown(copyPlayer[copyPlayerIndex].id);
                                        copyPlayer[copyPlayerIndex].games = copyPlayer[copyPlayerIndex].games - 1;
                                        setPlayerList(copyPlayer);
                                        const copyWaitGames = [...waitGameListId];
                                        copyWaitGames.splice(playerIndex, 1);
                                        setWaitGameListId(copyWaitGames);
                                        console.log("after : ", copyWaitGames);
                                    }

                                    setGamePointer(index);
                                }}
                            >
                                {waitGameListId.map((game, idx) => {
                                    if (game.point == index) {
                                        const player: Player | undefined = playerList.find(
                                            (player) => player.id === game.playerid
                                        );
                                        if (player) {
                                            return (
                                                <div key={idx} className="flex flex-col -z-10">
                                                    <PlayerCard {...player} />
                                                </div>
                                            );
                                            return null;
                                        }
                                    }
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                {/* {gamePointer} */}
                {/* {game1?.gameid}
                {game2?.gameid}
                {game3?.gameid} */}
            </div>
            {/* 우측 화면 */}
            <div className="w-1/4 bg-gray-400 p-4 h-screen overflow-y-auto">
                <div className="flex flex-row justify-between items-center">
                    <div>{waitPlayerList.length} 명</div>
                    <EllipsisVerticalIcon
                        onClick={() => {
                            setShowEdit(!showEdit);
                        }}
                        className="w-6 h-6"
                    ></EllipsisVerticalIcon>
                </div>
                <div>
                    <div className="flex flex-row *:w-1/2 *:flex *:text-center *:justify-center *:items-center *:bg-blue-500 *:rounded-lg gap-1 my-2 *:shadow-lg *:text-white h-8 *:cursor-pointer">
                        <div
                            onClick={() => {
                                setHowSort("games");
                                sortWaitPlayerByGames();
                            }}
                        >
                            경기수
                        </div>
                        <div
                            onClick={() => {
                                setHowSort("name");
                                sortWaitPlayerByNames();
                            }}
                        >
                            이름순
                        </div>
                    </div>
                    {waitPlayerList.map((waitPlayer, index) => {
                        const playerData: Player | undefined = playerList.find(
                            (player) => player.id === waitPlayer.Playerid
                        );
                        if (!playerData) {
                            return (
                                <div key={index}>
                                    <p>데이터베이스 동기화가 필요합니다.</p>
                                    <p>새로고침을 한번 눌러주세요</p>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={`wait ${playerData?.id}`}
                                className={`flex flex-col relative rounded-xl border-2 ${
                                    howManyGame(playerData!.id) >= 1 ? "border-green-400" : null
                                }`}
                            >
                                <div
                                    className="flex flex-col"
                                    onClick={() => {
                                        enterWaitGame(playerData!.id);
                                    }}
                                >
                                    <div key={playerData?.id} className="flex flex-col z-1">
                                        {playerData && <PlayerCard {...playerData} />}
                                    </div>
                                </div>
                                <button
                                    className="absolute -right-3 -top-3 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                                    onClick={() => {
                                        const data = [...waitPlayerList];
                                        const playerid = data[index].Playerid;
                                        data.splice(index, 1);
                                        const result = handleExitPlayer(playerid);
                                        console.log("handleExitPlayer : ", result);
                                        setWaitPlayerList(data);
                                    }}
                                >
                                    <span className="text-xs">×</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
                {/* test button */}
                <button
                    className="bg-blue-500 text-white rounded-xl w-32 h-12 flex items-center justify-center shadow-lg mt-4"
                    onClick={() => {
                        // makePlayer(1, 6);
                        sendMessage("hellow from server");
                        resetPlayer(Number(id));
                    }}
                >
                    DB 동기화
                </button>
                {/* ClearList Button */}
                {/* <button
                    className="bg-red-500 text-white rounded-xl w-32 h-12 flex items-center justify-center shadow-lg mt-4"
                    onClick={() => {
                        if (confirm("Are you sure?")) {
                            setWaitPlayerList([]);
                        }
                    }}
                >
                    Clear List
                </button> */}
            </div>
            {/* 우측 하단 고정 아이콘 */}
            <div className="fixed z-50 bottom-4 right-4">
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
            {showEdit && (
                <div className="fixed top-10 right-4 bg-white shadow-lg rounded-lg p-4">
                    <div className="text-center">
                        <Link href={`/editClub/${id}`} className="text-blue-500 hover:text-blue-700">
                            클럽 정보 수정
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
