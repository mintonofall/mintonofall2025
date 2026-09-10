/**
 * @file /app/home/[id]/LeftTopSection.tsx
 * @description 메인 대시보드의 왼쪽 상단 섹션. 현재 게임이 진행 중인 코트 목록을 표시합니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useEffect, useState } from "react";

/**
 * LeftTopSection 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {number} props.howManyCourts - 클럽의 총 코트 수
 * @param {number} props.courtPointer - 현재 선택된(다음에 게임이 배정될) 코트 인덱스
 * @param {(index: number) => void} props.setCourtPointer - 코트 선택 상태 변경 함수
 * @param {any[]} props.courts - 현재 게임이 진행 중인 코트 데이터 배열
 * @param {(index: number) => void} props.onGameEnd - '경기 종료' 버튼 클릭 이벤트 핸들러
 * @param {(index: number) => void} props.onGameCancel - '경기 취소' 버튼 클릭 이벤트 핸들러
 */
export default function LeftTopSection({
    howManyCourts,
    courtPointer,
    setCourtPointer,
    courts,
    onGameEnd,
    onGameCancel,
}: {
    howManyCourts: number;
    courtPointer: number;
    setCourtPointer: (index: number) => void;
    courts: any[];
    onGameEnd?: (index: number) => void;
    onGameCancel?: (index: number) => void;
}) {
    /** @type {Date} 현재 시간을 저장하는 상태. 1분마다 업데이트되어 경과 시간을 다시 계산합니다. */
    const [now, setNow] = useState(new Date());

    /**
     * 1분마다 현재 시간을 업데이트하는 `useEffect`
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    /**
     * 게임 시작 시간으로부터 경과된 시간을 계산하여 문자열로 반환하는 함수
     * @param {string | Date} startTime - 게임 시작 시간
     * @returns {string} 경과 시간 문자열 (e.g., "방금 전", "5분 전")
     */
    const getElapsedTime = (startTime: string | Date) => {
        const start = new Date(startTime);
        const diff = now.getTime() - start.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes < 1 ? "방금 전" : `${minutes}분 전`;
    };

    /**
     * 선수의 아바타 이미지 URL을 반환하는 함수
     * @param {any} player - 선수 정보
     */
    const getAvatarSrc = (player: any) => {
        if (!player?.avater) return null;
        return player.avater.startsWith("https://imagedelivery.net/") ? `${player.avater}/avatar` : player.avater;
    };

    // 코트가 6개 또는 8개면 한 줄에 다 넣기엔 좁아지므로 두 줄로 배치합니다.
    // 이 경우 칸 높이가 절반으로 줄어들기 때문에 내부 요소들도 함께 축소합니다.
    const isTwoRows = howManyCourts === 6 || howManyCourts === 8;
    let courtsContainerClass = "flex h-full gap-2";
    if (howManyCourts === 6) {
        courtsContainerClass = "grid grid-cols-3 grid-rows-2 h-full gap-2";
    } else if (howManyCourts === 8) {
        courtsContainerClass = "grid grid-cols-4 grid-rows-2 h-full gap-2";
    }

    return (
        <div className="h-[30%] p-4 bg-gray-50">
            <div className={courtsContainerClass}>
                {/* 클럽의 코트 수만큼 코트 컴포넌트를 렌더링 */}
                {Array.from({ length: howManyCourts }).map((_, index) => {
                    const courtData = courts[index];
                    // 해당 코트의 게임이 리그 게임인지 확인
                    const isLeagueGame =
                        courtData &&
                        courtData.p1?.isJoinLeague &&
                        courtData.p2?.isJoinLeague &&
                        courtData.p3?.isJoinLeague &&
                        courtData.p4?.isJoinLeague;

                    const avatarSizeClass = "w-12 h-12";
                    const nameOverlayTextClass = isTwoRows ? "text-[21px]" : "text-[10px]";

                    return (
                        <div
                            key={index}
                            // courtPointer와 인덱스가 일치하는 코트(다음에 게임이 배정될 코트)는 다른 배경색으로 강조
                            className={`relative flex-1 flex flex-col items-center justify-center rounded shadow-sm cursor-pointer overflow-hidden ${
                                isTwoRows ? "p-0" : "p-2"
                            } ${courtPointer === index ? "bg-green-500" : "bg-white"}`}
                            onClick={() => setCourtPointer(index)}
                        >
                            {/* 리그 게임일 경우 '리그게임' 배지 표시 */}
                            {isLeagueGame && (
                                <div
                                    className={`absolute top-1 left-1 bg-yellow-400 text-yellow-800 font-bold rounded z-10 ${
                                        isTwoRows ? "px-1 py-0.5 text-[9px]" : "px-2 py-1 text-xs"
                                    }`}
                                >
                                    리그게임
                                </div>
                            )}
                            {/* 상단 헤더: 코트 상태 텍스트.
                                2줄 모드는 사진을 최대한 키우기 위해 맨 위에 작게 고정(절대위치)하고,
                                1줄 모드는 기존처럼 사진 위 흐름 안에 배치합니다. */}
                            <div
                                className={
                                    isTwoRows
                                        ? "absolute top-0.5 inset-x-0 flex items-center justify-center z-10"
                                        : "flex items-center justify-center"
                                }
                            >
                                <span
                                    // 코트가 비어있으면 'Court N', 게임 중이면 경과 시간 표시
                                    className={`font-bold ${isTwoRows ? "text-[9px]" : "text-lg"} ${courtPointer === index ? "text-white" : "text-gray-600"}`}
                                >
                                    {courtData ? getElapsedTime(courtData.startTime) : `Court ${index + 1}`}
                                </span>
                            </div>
                            {courtData && (
                                <>
                                    {!courtData.isLoading && (
                                        // 경기 취소 버튼
                                        <button
                                            className={`absolute top-1 right-1 flex items-center justify-center bg-white/80 hover:bg-red-100 rounded-full shadow-sm text-gray-500 hover:text-red-600 transition-colors ${
                                                isTwoRows ? "w-4 h-4" : "w-6 h-6"
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCourtPointer(index);
                                                onGameCancel?.(index);
                                            }}
                                        >
                                            <span className={isTwoRows ? "text-[9px] font-bold" : "text-xs font-bold"}>
                                                ✕
                                            </span>
                                        </button>
                                    )}
                                    {/* 게임에 참여 중인 선수 얼굴 (이름은 사진 하단에 겹쳐서 표시) */}
                                    <div
                                        className={
                                            isTwoRows
                                                ? "flex flex-row justify-center w-full gap-0"
                                                : "grid grid-cols-2 w-full gap-2 mt-2 px-2"
                                        }
                                    >
                                        {[courtData.p1, courtData.p2, courtData.p3, courtData.p4].map(
                                            (player, playerIndex) => {
                                                const avatarSrc = getAvatarSrc(player);
                                                return (
                                                    <div
                                                        key={playerIndex}
                                                        className={
                                                            isTwoRows
                                                                ? "relative flex-1 aspect-square min-w-0 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center"
                                                                : `relative mx-auto rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center ${avatarSizeClass}`
                                                        }
                                                    >
                                                        {avatarSrc ? (
                                                            <img
                                                                src={avatarSrc}
                                                                alt={player?.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[9px] text-gray-400">No</span>
                                                        )}
                                                        {/* 이름표: 사진 하단에 겹쳐서 표시 */}
                                                        <span
                                                            className={`absolute bottom-0 left-0 right-0 bg-black/50 text-white font-bold text-center truncate leading-tight px-0.5 ${nameOverlayTextClass}`}
                                                        >
                                                            {player?.name}
                                                        </span>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                    {!courtData.isLoading && (
                                        // 경기완료 버튼: 코트 카드 하단에 배치
                                        <button
                                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm transition-colors z-10 ${
                                                isTwoRows ? "mt-0.5 mb-0.5 px-2 py-0.5 text-[10px]" : "mt-2 px-3 py-1 text-xs"
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCourtPointer(index);
                                                onGameEnd?.(index);
                                            }}
                                        >
                                            경기완료
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
