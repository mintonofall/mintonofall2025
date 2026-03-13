import { useEffect, useState } from "react";

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
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const getElapsedTime = (startTime: string | Date) => {
        const start = new Date(startTime);
        const diff = now.getTime() - start.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes < 1 ? "방금 전" : `${minutes}분 전`;
    };

    return (
        <div className="h-[30%] border p-4 bg-gray-50">
            <div className="flex h-full gap-2">
                {Array.from({ length: howManyCourts }).map((_, index) => {
                    const courtData = courts[index];
                    const isLeagueGame =
                        courtData &&
                        courtData.p1?.isJoinLeague &&
                        courtData.p2?.isJoinLeague &&
                        courtData.p3?.isJoinLeague &&
                        courtData.p4?.isJoinLeague;

                    return (
                        <div
                            key={index}
                            className={`relative flex-1 border flex flex-col items-center justify-center rounded shadow-sm cursor-pointer ${
                                courtPointer === index ? "bg-green-500" : "bg-white"
                            }`}
                            onClick={() => setCourtPointer(index)}
                        >
                            {isLeagueGame && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-800 text-xs font-bold rounded z-10">
                                    리그게임
                                </div>
                            )}
                            <span
                                className={`text-xl font-bold ${courtPointer === index ? "text-white" : "text-gray-600"}`}
                            >
                                {courtData ? getElapsedTime(courtData.startTime) : `Court ${index + 1}`}
                            </span>
                            {courtData && (
                                <>
                                    {!courtData.isLoading && (
                                        <button
                                            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white/80 hover:bg-red-100 rounded-full shadow-sm text-gray-500 hover:text-red-600 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCourtPointer(index);
                                                onGameCancel?.(index);
                                            }}
                                        >
                                            <span className="text-xs font-bold">✕</span>
                                        </button>
                                    )}
                                    <div
                                        className={`text-xs mt-2 grid grid-cols-2 gap-x-2 gap-y-1 ${courtPointer === index ? "text-white" : "text-gray-800"}`}
                                    >
                                        <span>{courtData.p1?.name}</span>
                                        <span>{courtData.p2?.name}</span>
                                        <span>{courtData.p3?.name}</span>
                                        <span>{courtData.p4?.name}</span>
                                    </div>
                                    {!courtData.isLoading && (
                                        <button
                                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded shadow-sm transition-colors z-10"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCourtPointer(index);
                                                onGameEnd?.(index);
                                            }}
                                        >
                                            경기 종료
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
