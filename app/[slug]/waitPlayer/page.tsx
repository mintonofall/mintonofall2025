import PlayerCard from "@/app/component/PlayerCard";
import { getWaitPlayerList } from "@/lib/getUserGoHome";

export default async function waitPlayerList({ params }: { params: Promise<{ slug: string }> }) {
    const clubid = Number((await params).slug);

    const playerListData = await getWaitPlayerList(clubid);

    return (
        <div className="flex justify-center py-8 bg-gray-100">
            <div className="flex flex-wrap gap-4 max-w-6xl">
                {playerListData.map((player) => (
                    <div
                        className="flex flex-col w-52 gap-4 p-4 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105"
                        key={player.Playerid}
                    >
                        <PlayerCard {...player.player} />
                    </div>
                ))}
            </div>
        </div>
    );
}
