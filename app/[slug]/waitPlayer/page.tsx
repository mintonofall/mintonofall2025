import PlayerCard from "@/app/component/PlayerCard";
import { getWaitPlayerList } from "@/lib/getUserGoHome";

export default async function waitPlayerList({ params }: { params: Promise<{ slug: string }> }) {
    const clubid = Number((await params).slug);

    const playerListData = await getWaitPlayerList(clubid);

    return (
        <div className="flex justify-center bg-gray-100">
            <div className="flex flex-wrap gap-1 max-w-4xl">
                {playerListData.map((player) => (
                    <div
                        className="flex flex-col w-auto gap-1 p-2 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
                        key={player.Playerid}
                    >
                        <PlayerCard {...player.player} />
                    </div>
                ))}
            </div>
        </div>
    );
}
