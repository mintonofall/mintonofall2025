import getPlayerList from "@/lib/getPlayerList";
import { getMatch, getWaitGames, getWaitPlayerList } from "@/lib/getUserGoHome";
import { getPlayer as gP } from "@/lib/getUserGoHome";
import GameBoard from "./GameBoard";
import WaitGames from "./WaitGames";

export default async function Board({ params }: { params: Promise<{ slug: string }> }) {
    const clubid = Number((await params).slug);
    console.log("clubid : " + clubid);

    const [players, gameboards, waitGames] = await Promise.all([
        getPlayerList(clubid),
        getMatch(clubid),
        getWaitGames(clubid),
        getWaitPlayerList(clubid),
    ]);
    const guestPlayer = await gP(12);

    if (guestPlayer) {
        players.push(guestPlayer);
    }
    // const findPlayer = players.find((player) => player.id === 12);
    // console.log("findPlayer : " + JSON.stringify(findPlayer));
    // console.log("guestPlayer : " + JSON.stringify(guestPlayer));
    // const waitGames = await getWaitGames(clubid);
    // console.log("waitGames : " + waitGames);
    // const gameboards = await getMatch(clubid);
    // console.log("gameboards : " + gameboards);

    return (
        <div className="container mx-auto p-1">
            <ul className="space-y-1">
                <GameBoard gameboards={gameboards} players={players} clubid={clubid} />
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-center pt-5">대기 게임</h2>
            <WaitGames waitGames={waitGames} players={players} clubid={clubid} />

            <div className="mt-2 flex justify-center">
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
