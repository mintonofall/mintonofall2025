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
        <div className="flex items-center w-full">
            <Image
                src={`${player.avater}/public`}
                width={100}
                height={100}
                alt={player.name}
                className="rounded-3xl"
                style={{
                    objectFit: "cover",
                    width: "100px",
                    height: "100px",
                }}
            />
            <div className="ml-4">
                <div>{player.name}</div>
                <div className="flex">
                    <div>{player.age}</div>
                    <div>{player.grade}</div>
                </div>
                <div>경기수: {player.games}</div>
                <div>
                    {player.win}승 {player.lose}패
                </div>
            </div>
        </div>
    );
}
