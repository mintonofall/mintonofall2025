import { useEffect, useState } from "react";

export default function RightSection({
    waitPlayerList = [],
    onExit,
    onPlayerClick,
    gridData = [],
    courts = [],
    onSort,
    currentSort,
}: {
    waitPlayerList?: any[];
    onExit?: (id: number) => void;
    onPlayerClick?: (player: any) => void;
    gridData?: any[];
    courts?: any[];
    onSort?: (criteria: string) => void;
    currentSort?: string;
}) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const getElapsedTime = (startTime: string | Date) => {
        if (!startTime) return "";
        const start = new Date(startTime);
        const diff = now.getTime() - start.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes < 1 ? "방금" : `${minutes}분`;
    };

    const getTodayGameCount = (gameDatas: any[]) => {
        if (!gameDatas || !Array.isArray(gameDatas)) return 0;
        const today = new Date().toDateString();
        return gameDatas.filter((date) => new Date(date).toDateString() === today).length;
    };

    return (
        <div className="w-[30%] border p-4 bg-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold shrink-0">입장 명단 ({waitPlayerList.length}명)</h1>
                <div className="flex space-x-1 text-xs">
                    <button
                        onClick={() => onSort?.("name")}
                        className={`px-2 py-1 rounded ${currentSort === "name" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                    >
                        이름
                    </button>
                    <button
                        onClick={() => onSort?.("grade")}
                        className={`px-2 py-1 rounded ${currentSort === "grade" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                    >
                        급수
                    </button>
                    <button
                        onClick={() => onSort?.("games")}
                        className={`px-2 py-1 rounded ${currentSort === "games" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                    >
                        경기
                    </button>
                    <button
                        onClick={() => onSort?.("participating")}
                        className={`px-2 py-1 rounded ${currentSort === "participating" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                    >
                        참여
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
                {waitPlayerList.map((player, index) => {
                    const isPlaying = courts.some(
                        (court) =>
                            court &&
                            (court.p1?.id === player.id ||
                                court.p2?.id === player.id ||
                                court.p3?.id === player.id ||
                                court.p4?.id === player.id),
                    );

                    return (
                        <div
                            key={player.id}
                            className={`p-2 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-50 ${
                                gridData.some((p) => p && p.id === player.id)
                                    ? "bg-green-100"
                                    : isPlaying
                                      ? "bg-green-300"
                                      : "bg-white"
                            }`}
                            onClick={() => onPlayerClick?.(player)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {player.avater ? (
                                        <img
                                            src={`${player.avater}`}
                                            alt={player.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                            No
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm ">{player.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {getElapsedTime(player.clickedTime)}
                                        </span>
                                        {player.isJoinLeague && (
                                            <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold">
                                                리그참가
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {player.age} • {player.grade}조 • {getTodayGameCount(player.gameDatas)}경기
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onExit?.(player.id);
                                    }}
                                >
                                    퇴장
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
