import getPlayerList from "@/lib/getPlayerList";
import { getMatch, getWaitGames } from "@/lib/getUserGoHome";
import { Player } from "@/lib/interface";
import { getPlayer as gP } from "@/lib/getUserGoHome";
import Image from "next/image";

export default async function Board({ params }: { params: Promise<{ slug: string }> }) {
    const clubid = Number((await params).slug);
    console.log("clubid : " + clubid);
    const players = await getPlayerList(clubid);
    const guestPlayer = await gP(12);

    if (guestPlayer) {
        players.push(guestPlayer);
    }
    const findPlayer = players.find((player) => player.id === 12);
    console.log("findPlayer : " + JSON.stringify(findPlayer));
    console.log("guestPlayer : " + JSON.stringify(guestPlayer));
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Board</h1>
            <ul className="space-y-4">
                {gameboards.map((gameboard, idx) => (
                    <li key={idx} className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Court {idx + 1}</h2>
                        <div className="flex justify-around items-center">
                            {[gameboard.player1id, gameboard.player2id, gameboard.player3id, gameboard.player4id].map(
                                (playerId, index) => {
                                    const player = getPlayer(playerId);
                                    return (
                                        <div key={index} className="flex flex-col items-center">
                                            <Image
                                                src={`${player.avater}/avatar`}
                                                width={50}
                                                height={50}
                                                alt=""
                                                className="rounded-full"
                                            />
                                            <span className="mt-2 text-sm font-medium">{player.name}</span>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="grid grid-cols-4 gap-2 mt-8">
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
                                alt=""
                                className="rounded-full"
                            />
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 flex justify-center">
                <iframe
                    src="https://ads-partners.coupang.com/widgets.html?id=832777&template=carousel&trackingCode=AF4491570&subId=&width=380&height=100&tsource="
                    width="380"
                    height="100"
                    frameBorder="0"
                    scrolling="no"
                    referrerPolicy="unsafe-url"
                    className="border rounded-lg shadow-md"
                ></iframe>
            </div>
        </div>
    );
}
