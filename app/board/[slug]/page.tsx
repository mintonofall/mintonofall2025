import db from "@/lib/db";
import getPlayerList from "@/lib/getPlayerList";
import { getMatch, getWaitGames } from "@/lib/getUserGoHome";
import { Player } from "@/lib/interface";
import Image from "next/image";

export default async function Board({ params }: { params: Promise<{ slug: string }> }) {
    const clubid = Number((await params).slug);
    console.log("clubid : " + clubid);
    const players = await getPlayerList(clubid);
    console.log("players : " + players);
    const waitGames = await getWaitGames(clubid);
    console.log("waitGames : " + waitGames);
    const gameboards = await getMatch(clubid);
    console.log("gameboards : " + gameboards);
    function getPlayer(id: number): Player {
        return players.filter((player) => player.id === id)[0];
    }

    const getWaitGamePlayerId = (point: number): number => {
        const games = waitGames.find((wait) => wait.point === point);
        const game = games ? games.playerid : 12;
        return game;
    };

    return (
        <div>
            <h1>Board</h1>
            <ul>
                {gameboards.map((gameboard, idx) => (
                    <li key={idx}>
                        <div className="p-4 border rounded-lg shadow-md bg-white">
                            <h2 className="text-xl font-bold mb-4">Court {idx + 1}</h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={`${getPlayer(gameboard.player1id).avater}/avatar`}
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="rounded-full"
                                    />
                                    <span className="mt-2 text-sm">{getPlayer(gameboard.player1id).name}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={`${getPlayer(gameboard.player2id).avater}/avatar`}
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="rounded-full"
                                    />
                                    <span className="mt-2 text-sm">{getPlayer(gameboard.player2id).name}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={`${getPlayer(gameboard.player3id).avater}/avatar`}
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="rounded-full"
                                    />
                                    <span className="mt-2 text-sm">{getPlayer(gameboard.player3id).name}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={`${getPlayer(gameboard.player4id).avater}/avatar`}
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="rounded-full"
                                    />
                                    <span className="mt-2 text-sm">{getPlayer(gameboard.player4id).name}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 16 }).map((_, idx) => {
                    const playerId = getWaitGamePlayerId(idx);
                    const player = getPlayer(playerId);
                    return (
                        <div key={idx} className="p-4 border rounded-lg shadow-md bg-white">
                            <span>{player.name}</span>
                            <span>
                                <Image src={`${player.avater}/avatar`} width={50} height={50} alt="" />
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
