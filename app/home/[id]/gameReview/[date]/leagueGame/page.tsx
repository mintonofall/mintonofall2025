import db from "@/lib/db";
import Link from "next/link";
import { getClub } from "@/lib/getUserGoHome";

// 플레이어 아바타 및 이름을 렌더링하는 작은 UI 컴포넌트
const PlayerCard = ({ player }: { player: any }) => {
    if (!player) {
        return (
            <div className="w-20 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 shadow-sm border border-gray-100">
                    -
                </div>
                <span className="text-xs font-semibold text-gray-400">-</span>
            </div>
        );
    }

    const avatarSrc = player.avater?.startsWith("https://imagedelivery.net/")
        ? `${player.avater}/avatar`
        : player.avater;

    return (
        <div className="flex flex-col items-center gap-1 w-20">
            {avatarSrc ? (
                <img
                    src={avatarSrc}
                    alt={player.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100 border border-gray-200"
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 shadow-sm border border-gray-200">
                    No Img
                </div>
            )}
            <span className="text-xs font-semibold text-gray-700 truncate w-full text-center">{player.name}</span>
            {player.isJoinLeague && (
                <span className="px-1 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[9px] font-bold whitespace-nowrap">
                    리그경기 참가자
                </span>
            )}
        </div>
    );
};

// 날짜 객체를 HH:mm 형태로 포맷팅해주는 헬퍼 함수
const formatTime = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
};

export default async function LeagueGamePage({ params }: { params: Promise<{ id: string; date: string }> }) {
    const { id, date } = await params;
    const clubId = Number(id);

    // 해당 날짜 시작/종료 시간 계산
    const dayStart = new Date(`${date}T00:00:00+09:00`);
    const dayEnd = new Date(`${date}T23:59:59.999+09:00`);

    // 선수 정보 조회 (화면에 아바타 및 이름 표시용)
    const club = await getClub(clubId);
    const players = club?.players || [];

    // 해당 날짜의 리그 경기들 조회
    const matches = await db.match.findMany({
        where: {
            clubid: clubId,
            endTime: {
                gte: dayStart,
                lt: dayEnd,
            },
            // TODO: 데이터베이스에 리그 게임을 구별하는 필드가 있다면 아래에 추가해 주세요.
            // 예: gameType: "LEAGUE", 혹은 isLeague: true
        },
        orderBy: {
            endTime: "desc", // 최신 종료 경기부터 나열
        },
    });

    // 선수 ID로 전체 객체를 찾아주는 헬퍼
    const getPlayer = (pid: number | null) => players.find((p: any) => p.id === pid) || null;

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mb-8 gap-4">
                <h1 className="text-3xl font-bold text-blue-600">{date} 리그 게임 결과</h1>
                <Link
                    href={`/home/${clubId}/gameReview/${date}`}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                    돌아가기
                </Link>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-4">
                {matches.length > 0 ? (
                    matches.map((match) => {
                        const p1 = getPlayer(match.player1id);
                        const p2 = getPlayer(match.player2id);
                        const p3 = getPlayer(match.player3id);
                        const p4 = getPlayer(match.player4id);

                        const isTeam1Win = match.winner1id === match.player1id || match.winner1id === match.player2id;
                        const isTeam2Win = match.winner1id === match.player3id || match.winner1id === match.player4id;

                        const startTimeStr = formatTime(match.startTime);

                        return (
                            <div
                                key={match.id}
                                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
                            >
                                {/* Team 1 */}
                                <div
                                    className={`flex flex-col items-center p-3 rounded-xl w-full sm:w-2/5 ${isTeam1Win ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-transparent"}`}
                                >
                                    {isTeam1Win && (
                                        <span className="text-yellow-600 font-bold text-xs mb-2 tracking-widest">
                                            WINNER
                                        </span>
                                    )}
                                    <div className="flex justify-center gap-4 w-full">
                                        <PlayerCard player={p1} />
                                        <PlayerCard player={p2} />
                                    </div>
                                </div>

                                {/* VS & Time Info */}
                                <div className="flex flex-col items-center justify-center gap-1 w-full sm:w-1/5 text-center my-2 sm:my-0">
                                    {startTimeStr && (
                                        <div className="text-[11px] text-gray-500 font-medium bg-gray-100 border border-gray-200 px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                            {startTimeStr}
                                        </div>
                                    )}
                                    <div className="text-gray-400 font-black italic text-xl mt-1">VS</div>
                                </div>

                                {/* Team 2 */}
                                <div
                                    className={`flex flex-col items-center p-3 rounded-xl w-full sm:w-2/5 ${isTeam2Win ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-transparent"}`}
                                >
                                    {isTeam2Win && (
                                        <span className="text-yellow-600 font-bold text-xs mb-2 tracking-widest">
                                            WINNER
                                        </span>
                                    )}
                                    <div className="flex justify-center gap-4 w-full">
                                        <PlayerCard player={p3} />
                                        <PlayerCard player={p4} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-200 font-medium">
                        해당 날짜에 기록된 리그 게임이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
