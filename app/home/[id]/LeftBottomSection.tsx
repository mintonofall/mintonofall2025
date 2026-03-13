/**
 * @file /app/home/[id]/LeftBottomSection.tsx
 * @description 메인 대시보드의 왼쪽 하단 섹션. 선수들이 게임을 대기하는 7x5 그리드 판을 표시합니다.
 * @author Treebird
 * @date 2024-07-16
 */

/**
 * LeftBottomSection 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {number | null} props.selectedCell - 현재 선택된 셀의 인덱스
 * @param {(index: number) => void} props.onCellClick - 셀 클릭 이벤트 핸들러
 * @param {any[]} props.gridData - 35칸 그리드에 표시될 선수 데이터 배열
 * @param {(index: number) => void} props.onRemovePlayer - 그리드에서 선수 제거 이벤트 핸들러
 * @param {(index: number) => void} props.onGameStart - '게임 시작' 버튼 클릭 이벤트 핸들러
 */
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
    /**
     * 선수의 오늘 경기 횟수를 계산하는 함수
     * @param {any[]} gameDatas - 선수의 경기 날짜 기록 배열
     * @returns {number} 오늘 진행한 경기 수
     */
    const getTodayGameCount = (gameDatas: any[]) => {
        if (!gameDatas || !Array.isArray(gameDatas)) return 0;
        const today = new Date().toDateString();
        return gameDatas.filter((date) => new Date(date).toDateString() === today).length;
    };

    return (
        <div className="h-[70%] border p-4 bg-gray-50">
            <div className="grid grid-cols-[1fr_4fr_4fr_4fr_4fr] grid-rows-7 gap-1 h-full">
                {/* 35개의 셀을 렌더링 (7행 5열) */}
                {Array.from({ length: 35 }).map((_, index) => (
                    <div
                        key={index}
                        // 첫 번째 열(게임 시작 버튼)과 선택된 셀은 다른 배경색을 가짐
                        className={`border flex items-center justify-center relative ${
                            index % 5 === 0 ? "bg-gray-200" : selectedCell === index ? "bg-blue-200" : "bg-white"
                        }`}
                        onClick={() => {
                            if (index % 5 !== 0) onCellClick(index);
                        }}
                    >
                        {/* 첫 번째 열(인덱스가 5의 배수)에는 '게임 시작' 버튼 렌더링 */}
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
                                                src={
                                                    gridData[index].avater?.startsWith("https://imagedelivery.net/")
                                                        ? `${gridData[index].avater}/avatar`
                                                        : gridData[index].avater
                                                }
                                                alt={gridData[index].name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No
                                            </div>
                                        )}
                                    </div>
                                    {/* 선수 정보 (이름, 나이, 급수, 경기 수 등) */}
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
                                {/* isSaved가 true일 때만 제거 버튼 표시 (DB에 저장된 항목) */}
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
                            // 빈 셀
                            ""
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
