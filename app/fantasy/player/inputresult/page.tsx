import { getFantasyPlayers } from "@/lib/fantasy";
import { FantasyPlayer } from "@prisma/client";
import InputForm from "./InputForm";

export default async function InputResult() {
    const players: FantasyPlayer[] = await getFantasyPlayers(2024);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">판타지 리그 결과 입력</h1>
            <InputForm players={players} />
        </div>
    );
}
