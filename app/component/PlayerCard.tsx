/**
 * @file /app/component/PlayerCard.tsx
 * @description 개별 선수의 정보를 간략하게 표시하는 카드 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { Player } from "@/lib/interface";
import { ELEMENT_STYLE, type SajuResult } from "@/lib/sajuTypes";
import { ZODIAC_STYLE } from "@/lib/zodiac";

/**
 * @param {Player} player - 표시할 선수 정보 객체
 * @param {boolean} [showBadges] - "이게 나에요"로 연결된 MBTI/오행/별자리 배지를 함께 보여줄지 여부 (기본 false)
 */
export default function PlayerCard(player: Player & { showBadges?: boolean }) {
    const avatarSrc = player.avater?.startsWith("https://imagedelivery.net/")
        ? `${player.avater}/avatar`
        : player.avater || "/guest.png";

    const saju = player.saju as SajuResult | null;
    const hasBadges = !!(player.mbti || saju?.baseElement || saju?.zodiac);

    return (
        <div key={player.id} className="flex items-center w-full gap-1.5 p-1 bg-white shadow-md rounded-lg">
            <div className="flex items-center h-15 flex-1 min-w-0">
                <img
                    src={avatarSrc}
                    alt={player.name}
                    className="rounded-xl"
                    style={{
                        objectFit: "cover",
                        width: "50px",
                        height: "50px",
                    }}
                />
                <div className="flex flex-col w-full ml-1 min-w-0">
                    <div className="flex flex-col items-center space-x-1">
                        <div className="text-sm font-semibold">{player.name}</div>
                        <div className="flex space-x-1">
                            <div className="text-xs text-gray-500">{player.age}</div>
                            <div className="text-xs text-gray-500">{player.grade}</div>
                        </div>
                    </div>
                    <div className="text-xs text-center w-full text-gray-700">
                        <div>
                            <div>경기수: {player.games}</div>
                            {/* {player.win}승 */}
                        </div>
                    </div>
                </div>
            </div>

            {player.showBadges && hasBadges && (
                <div className="flex flex-col gap-1 items-end shrink-0">
                    {player.mbti && (
                        <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                            <span>🧠</span>
                            <span className="font-semibold">{player.mbti}</span>
                        </span>
                    )}
                    {saju?.baseElement && (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                            <span>{ELEMENT_STYLE[saju.baseElement].emoji}</span>
                            <span className="font-semibold">{ELEMENT_STYLE[saju.baseElement].style}</span>
                        </span>
                    )}
                    {saju?.zodiac && ZODIAC_STYLE[saju.zodiac] && (
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                            <span>{ZODIAC_STYLE[saju.zodiac].emoji}</span>
                            <span className="font-semibold">{saju.zodiac}</span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
