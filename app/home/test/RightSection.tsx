import { useEffect, useState } from "react";

export default function RightSection({
    waitPlayerList = [],
    onExit,
    onPlayerClick,
    gridData = [],
    courts = [],
    onSort,
    currentSort,
    onEdit,
    onHistoryClick,
}: {
    waitPlayerList?: any[];
    onExit?: (id: number) => void;
    onPlayerClick?: (player: any) => void;
    gridData?: any[];
    courts?: any[];
    onSort?: (criteria: string) => void;
    currentSort?: string;
    onEdit?: (player: any) => void;
    onHistoryClick?: (player: any) => void;
}) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const getLastGameElapsedTime = (gameDatas: any[]) => {
        if (!gameDatas || !Array.isArray(gameDatas)) return "첫경기";
        const today = new Date().toDateString();
        const todayGames = gameDatas.filter((date) => new Date(date).toDateString() === today);

        if (todayGames.length === 0) return "첫경기";

        const lastGameTime = Math.max(...todayGames.map((d: any) => new Date(d).getTime()));
        const diff = now.getTime() - lastGameTime;
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes < 1 ? "방금 전" : `${minutes}분 전`;
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
                            className={`relative p-2 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-50 ${
                                gridData.some((p) => p && p.id === player.id)
                                    ? "bg-green-100"
                                    : isPlaying
                                      ? "bg-green-300"
                                      : "bg-white"
                            }`}
                            onClick={() => onPlayerClick?.(player)}
                        >
                            <button
                                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-gray-200/50 hover:bg-red-100 rounded-full shadow-sm text-gray-500 hover:text-red-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onExit?.(player.id);
                                }}
                            >
                                <span className="text-xs font-bold">✕</span>
                            </button>
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
                                            {getLastGameElapsedTime(player.gameDatas)}
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
                            <div className="flex flex-row gap-2 items-center justify-center pr-2">
                                <button
                                    className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full shadow text-gray-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onHistoryClick?.(player);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full shadow text-gray-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit?.(player);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
