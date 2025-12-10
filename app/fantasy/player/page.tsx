import { getFantasyPlayers } from "@/lib/fantasy";
import { FantasyPlayer } from "@prisma/client";
import Link from "next/link";

export default async function FantasyPage() {
    // 우선 2024년 선수 명단을 가져오도록 설정했습니다.
    const players: FantasyPlayer[] = await getFantasyPlayers(2025);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">2024년 판타지 리그 선수 명단</h1>
                <div className="flex gap-2">
                    <Link href="/fantasy/player/inputdata">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            선수 추가
                        </button>
                    </Link>
                    <Link href="/fantasy/player/inputresult">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            결과입력
                        </button>
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {players.map((player) => (
                    <div key={player.id} className="border rounded-lg p-4 shadow-md">
                        <img
                            src={player.photo || "/default-avatar.png"}
                            alt={player.name}
                            className="w-full h-16 object-cover rounded-md mb-2"
                        />
                        <div className="flex items-center gap-2">
                            {player.contry && <img src={player.contry} alt="국기" className="w-6 h-4 object-cover" />}
                            <h2 className="text-xl font-semibold">
                                {player.id}
                                {player.name}
                            </h2>
                        </div>
                        <p className="text-gray-600">종목: {player.event}</p>
                        <p className="text-gray-600">랭킹: {player.ranking}위</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
