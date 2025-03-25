"use client";

import { useEffect, useState } from "react";
import { getPlayersFromClub, makeMatch } from "@/lib/getClubDiary";
import { PlayerDiary } from "@/lib/interface";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import getSessionClient from "@/lib/sessionClient";
import Link from "next/link";

export default function Diary({ params }: { params: Promise<{ clubid: number }> }) {
    const [waitPlayerList, setWaitPlayerList] = useState<PlayerDiary[]>([]);
    const [userid, setUserid] = useState(0);
    const [clubid, setClubId] = useState(0);
    const [playerList, setPlayerList] = useState<PlayerDiary[]>([]);
    const [score1, setScore1] = useState<number>(25);
    const [score2, setScore2] = useState<number>(25);
    let clubidlet = 0;
    // const fakeDB = ["김민준", "이서준", "박예준", "최지우", "정하윤", "강서연", "윤지호", "임도윤", "오하린", "서윤아"];
    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).clubid;
            const session = await getSessionClient();

            setUserid(Number(session!.id));

            setClubId(Number(resolvedParams));
        }

        fetchParams();
    }, [params]);
    useEffect(() => {
        async function fetchPlayers() {
            const players = await getPlayersFromClub(clubid);
            console.log("clubid : ", clubid);
            setWaitPlayerList(players);
            console.log(players);
            clubidlet = clubid;
        }
        fetchPlayers();
    }, [clubid]);

    function handleClickedPlayer(player: PlayerDiary) {
        console.log(player.name);
        if (playerList.length >= 4) return;
        const copy = [...playerList];
        copy.push(player);
        setPlayerList(copy);
    }
    function handleMakeMatch() {
        console.log(playerList, clubid, score1, score2);
    }

    return (
        <div className="mb-16">
            <h1 className="text-3xl font-bold mb-4 text-center">Diary {clubid}</h1>
            <div className="flex h-1/2 flex-row gap-4">
                <div className="flex flex-col w-3/5 p-4 bg-white shadow-md rounded-lg">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Player 1</h2>
                        <div className="text-gray-700">{playerList[0] ? playerList[0].name : "No player selected"}</div>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Player 2</h2>
                        <div className="text-gray-700">{playerList[1] ? playerList[1].name : "No player selected"}</div>
                    </div>
                    <div className="text-2xl font-bold text-center mb-2">{score1}</div>
                    <div className="flex justify-center gap-0 mb-4">
                        <span className="m-0 p-0">5</span>
                        <MinusCircleIcon
                            onClick={() => {
                                setScore1(score1 - 5);
                            }}
                            className="h-6 w-6 text-red-500 cursor-pointer"
                        />
                        <MinusCircleIcon
                            onClick={() => {
                                setScore1(score1 - 1);
                            }}
                            className="h-6 w-6 mx-5 text-red-500 cursor-pointer"
                        />
                        <PlusCircleIcon
                            onClick={() => {
                                setScore1(score1 + 1);
                            }}
                            className="h-6 w-6 text-green-500 cursor-pointer"
                        />
                    </div>
                    <div className="border-b border-gray-300 my-4"></div>
                    <div className="flex justify-center gap-0 mb-4">
                        <span className="m-0 p-0">5</span>
                        <MinusCircleIcon
                            onClick={() => {
                                setScore2(score2 - 5);
                            }}
                            className="h-6 w-6 text-red-500 cursor-pointer"
                        />
                        <MinusCircleIcon
                            onClick={() => {
                                setScore2(score2 - 1);
                            }}
                            className="h-6 w-6 mx-5 text-red-500 cursor-pointer"
                        />
                        <PlusCircleIcon
                            onClick={() => {
                                setScore2(score2 + 1);
                            }}
                            className="h-6 w-6 text-green-500 cursor-pointer"
                        />
                    </div>
                    <div className="text-2xl font-bold text-center mb-4">{score2}</div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Player 3</h2>
                        <div className="text-gray-700">{playerList[2] ? playerList[2].name : "No player selected"}</div>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Player 4</h2>
                        <div className="text-gray-700">{playerList[3] ? playerList[3].name : "No player selected"}</div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                handleMakeMatch();
                                console.log(playerList);
                                console.log(score1);
                                console.log(score2);
                                console.log("clubid : ", clubidlet);
                                let winner1;
                                let winner2;
                                if (score1 === score2) {
                                    alert("무승부는 입력할 수 없습니다.");
                                    return;
                                }
                                if (score1 > score2) {
                                    winner1 = playerList[0].id;
                                    winner2 = playerList[1].id;
                                    console.log(winner1, winner2);
                                }
                                if (score1 < score2) {
                                    winner1 = playerList[2].id;
                                    winner2 = playerList[3].id;
                                    console.log(winner1, winner2);
                                }
                                console.log(
                                    [playerList[0].id, playerList[1].id, playerList[2].id, playerList[3].id],

                                    clubid,
                                    winner1,
                                    winner2,
                                    score1,
                                    score2
                                );

                                const result = makeMatch(
                                    [playerList[0].id, playerList[1].id, playerList[2].id, playerList[3].id],
                                    userid,
                                    clubid,
                                    winner1,
                                    winner2,
                                    score1,
                                    score2
                                );
                                console.log(result);
                                setPlayerList([]);
                                setScore1(25);
                                setScore2(25);
                            }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            결과입력
                        </button>
                        <button
                            onClick={() => {
                                const copy = [...playerList];
                                copy.pop();
                                setPlayerList(copy);
                            }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                            UNDO
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-2/5 p-4 pb-16 bg-gray-100 shadow-md rounded-lg overflow-scroll ">
                    {waitPlayerList.map((player) => (
                        <div
                            className="flex justify-between items-center p-2 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200"
                            onClick={() => handleClickedPlayer(player)}
                            key={player.id}
                        >
                            <div>
                                <h1 className="text-lg font-semibold">{player.name}</h1>
                                <div className="flex gap-2">
                                    <h2 className="text-sm text-gray-600">{player.age} </h2>
                                    <h2 className="text-sm text-gray-600">{player.grade}</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Link
                        href={{
                            pathname: `/diary/${clubid}/create`,
                            query: { userid: userid },
                        }}
                    >
                        <span className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                            새로만들기
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
