export default function LeftBottomSection({
    selectedCell,
    onCellClick,
    gridData,
    onRemovePlayer,
    onGameStart,
}: {
    selectedCell: number | null;
    onCellClick: (index: number) => void;
    gridData: any[];
    onRemovePlayer?: (index: number) => void;
    onGameStart?: (index: number) => void;
}) {
    const getTodayGameCount = (gameDatas: any[]) => {
        if (!gameDatas || !Array.isArray(gameDatas)) return 0;
        const today = new Date().toDateString();
        return gameDatas.filter((date) => new Date(date).toDateString() === today).length;
    };

    return (
        <div className="h-[70%] border p-4 bg-gray-50">
            <div className="grid grid-cols-[1fr_4fr_4fr_4fr_4fr] grid-rows-7 gap-1 h-full">
                {Array.from({ length: 35 }).map((_, index) => (
                    <div
                        key={index}
                        className={`border flex items-center justify-center relative ${
                            index % 5 === 0 ? "bg-gray-200" : selectedCell === index ? "bg-blue-200" : "bg-white"
                        }`}
                        onClick={() => {
                            if (index % 5 !== 0) onCellClick(index);
                        }}
                    >
                        {index % 5 === 0 ? (
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 shadow"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onGameStart?.(index);
                                }}
                            >
                                게임 시작
                            </button>
                        ) : gridData[index] ? (
                            <>
                                <div className="flex flex-row items-center justify-start w-full h-full overflow-hidden p-1 pl-2">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 mr-2">
                                        {gridData[index].avater ? (
                                            <img
                                                src={`${gridData[index].avater}`}
                                                alt={gridData[index].name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left leading-tight">
                                        <div className="flex items-center gap-1 h-5 w-full">
                                            <span className="font-bold text-sm truncate max-w-[60px]">
                                                {gridData[index].name}
                                            </span>
                                            {gridData[index].isJoinLeague && (
                                                <span className="px-1 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold whitespace-nowrap flex-shrink-0">
                                                    리그참가
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 block">
                                            {gridData[index].age} • {gridData[index].grade}조
                                        </span>
                                        <span className="text-xs text-blue-600 font-bold block">
                                            {getTodayGameCount(gridData[index].gameDatas)}경기
                                        </span>
                                    </div>
                                </div>
                                {gridData[index].isSaved && (
                                    <button
                                        className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-0.5 leading-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemovePlayer?.(index);
                                        }}
                                    >
                                        <span className="text-xs font-bold">✕</span>
                                    </button>
                                )}
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
