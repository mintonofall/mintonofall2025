import getPlayerList from "@/lib/getPlayerList";
import { Player } from "@/lib/interface";
import PlayerListComponent from "./PlayerList";

export default async function PlayerList({ params }: { params: Promise<{ id: number }> }) {
    const id = Number((await params).id);
    const playerList: Player[] = await getPlayerList(id, "name");

    return (
        <>
            <PlayerListComponent playerList={playerList} id={id} />
            {/* <div>
            <Link href={"/createPlayer/" + id}>선수등록</Link>

            {playerList.map((player) => (
                <div key={player.id} className="bg-white shadow-md rounded p-4 justify-between items-center flex">
                    <PlayerCard {...player} />
                    <Link href={`/editPlayer/${player.id}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                        >
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                    </Link>
                </div>
            ))}
        </div> */}
        </>
    );
}
