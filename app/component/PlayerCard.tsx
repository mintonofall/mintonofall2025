/**
 * @file /app/component/PlayerCard.tsx
 * @description 개별 선수의 정보를 간략하게 표시하는 카드 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { Player } from "@/lib/interface";

/**
 * @param {Player} player - 표시할 선수 정보 객체
 */
export default function PlayerCard(player: Player) {
    const avatarSrc = player.avater?.startsWith("https://imagedelivery.net/")
        ? `${player.avater}/avatar`
        : player.avater || "/guest.png";

    return (
        <div
            key={player.id}
            className="flex items-center w-full h-15 p-1.5 bg-white border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all rounded-xl"
        >
            <img
                src={avatarSrc}
                alt={player.name}
                className="rounded-lg ring-1 ring-emerald-100"
                style={{
                    objectFit: "cover",
                    width: "50px",
                    height: "50px",
                }}
            />
            <div className="flex flex-col w-full ml-2">
                <div className="flex flex-col items-center space-x-1">
                    <div className="text-sm font-semibold text-slate-800">{player.name}</div>
                    <div className="flex space-x-1">
                        <div className="text-xs text-slate-400">{player.age}</div>
                        <div className="text-xs text-slate-400">{player.grade}</div>
                    </div>
                </div>
                <div className="text-xs text-center w-full text-emerald-600 font-medium">
                    <div>
                        <div>경기수: {player.games}</div>
                        {/* {player.win}승 */}
                    </div>
                </div>
            </div>
        </div>
    );
}
