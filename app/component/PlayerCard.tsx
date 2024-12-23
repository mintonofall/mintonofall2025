interface Player {
    name: string;
    avater: string | null;
    age: number;
    grade: string;
    games: number;
    win: number;
    lose: number;
}

import Image from "next/image";
export default function PlayerCard(player: Player) {
    return (
        <div className="flex items-center w-full h-15 p-1 bg-white shadow-md rounded-lg">
            <Image
                src={`${player.avater}/public`}
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
                        경기수: {player.games}
                        {player.win}승
                    </div>
                </div>
            </div>
        </div>
    );
}
