import { Player } from "@/lib/interface";
import { exitPlayer } from "../../lib/getUserGoHome";
import PlayerCard from "./PlayerCard";

interface Props {
    key: number;
    player: Player;
    clubid: number;
    which: string;
}

export default function FromIdtoPlayerCard({ key, player, clubid, which }: Props) {
    return (
        <div key={key} className="p-1 relative">
            {player ? <PlayerCard {...player} /> : <p className="text-slate-400 text-sm">선수를 찾을 수 없습니다.</p>}
            <button
                className={`${
                    which === "waitPlayer" ? "flex" : "hidden"
                } absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 items-center justify-center text-xs cursor-pointer shadow-sm transition-colors`}
                onClick={() => {
                    exitPlayer(player.id, clubid);
                }}
            >
                ✕
            </button>
        </div>
    );
}
