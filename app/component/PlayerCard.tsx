import { Player } from "@/lib/interface";
import Image from "next/image";
export default function PlayerCard(player: Player) {
    return (
        <div key={player.id} className="flex items-center w-auto h-15 p-1 bg-white shadow-md rounded-lg">
            <Image
                src={`${player.avater}/avatar`}
                width={50}
                height={50}
                alt={player.name}
                className="rounded-xl"
                style={{
                    objectFit: "cover",
                    width: "50px",
                    height: "50px",
                }}
            />
            <div className="flex flex-col ml-2">
                <div className="flex flex-row items-center space-x-1">
                    <div className="text-sm font-semibold">{player.name}</div>
                    <div className="text-xs text-gray-500">{player.age}</div>
                    <div className="text-xs text-gray-500">{player.grade}</div>
                </div>
                <div className="text-xs text-gray-700">
                    <div>
                        <div>경기수: {player.games}</div>
                        {/* {player.win}승 */}
                    </div>
                </div>
            </div>
        </div>
    );
}
