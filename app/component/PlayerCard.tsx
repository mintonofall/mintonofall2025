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
        <div className="flex items-center w-full h-auto p-1 bg-white shadow-md rounded-lg">
            <Image
                src={`${player.avater}/public`}
                width={80}
                height={80}
                alt={player.name}
                className="rounded-full"
                style={{
                    objectFit: "cover",
                    width: "80px",
                    height: "80px",
                }}
            />
            <div className="flex flex-col ml-4">
                <div className="flex flex-row items-center space-x-2 mb-2">
                    <div className="text-lg font-semibold">{player.name}</div>
                    <div className="text-sm text-gray-500">{player.age}세</div>
                    <div className="text-sm text-gray-500">{player.grade}</div>
                </div>
                <div className="text-sm text-gray-700">
                    <div>경기수: {player.games}</div>
                    <div>
                        {player.win}승 {player.lose}패
                    </div>
                </div>
            </div>
        </div>
    );
}
