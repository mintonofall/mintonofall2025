import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { FantasyPlayer } from "@prisma/client";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";

type PageParams = Promise<{ leagueId: string }>;

async function getLeague(leagueId: number) {
    const data = await db.fantasyLeague.findUnique({
        where: { id: leagueId },
        // orderList를 사용하기 위해 select 또는 include가 필요할 수 있습니다.
        // 스키마에 따라 필요한 필드를 명시적으로 선택하는 것이 좋습니다.
        select: {
            id: true,
            leagueName: true,
            process: true,
            orderList: true,
        },
    });
    return data;
}

async function getTeams(leagueId: number) {
    const data = await db.fantasyTeam.findMany({
        where: { fantasyLeagueId: leagueId },
        include: {
            ms: {
                // 'msPlayer'는 FantasyTeam과 FantasyPlayer 모델 간의 관계 이름으로 가정합니다.
                select: { name: true, contry: true, photo: true, event: true, createdAt: true, updatedAt: true },
            },
            ws: {
                select: { name: true, contry: true, photo: true, event: true, createdAt: true, updatedAt: true },
            },
            md: {
                select: { name: true, contry: true, photo: true, event: true, createdAt: true, updatedAt: true },
            },
            wd: {
                select: { name: true, contry: true, photo: true, event: true, createdAt: true, updatedAt: true },
            },
            xd: {
                select: { name: true, contry: true, photo: true, event: true, createdAt: true, updatedAt: true },
            },
            wc: {
                select: { name: true, contry: true, photo: true, event: true, createdAt: true, updatedAt: true },
            },
            user: {
                // User 모델과의 관계를 통해 nickName을 가져옵니다.
                select: { nickName: true },
            },
        },
    });

    return data;
}

function PlayerInfoLeft({
    player,
    event,
    align = "left",
}: {
    player: Omit<FantasyPlayer, "id" | "year" | "ranking"> | null;
    event: string;
    align?: "left" | "right";
}) {
    const isRight = align === "right";
    return (
        <div className="flex-1">
            <h2 className={`text-xl font-semibold mb-2 mt-4 ${isRight ? "text-right" : ""}`}>
                {event === "와일드카드" ? "와일드카드" : event}
            </h2>
            {player ? (
                <div className={`flex items-center gap-4 ${isRight ? "justify-end" : ""}`}>
                    {isRight && (
                        <div className="text-right">
                            {event === "와일드카드" && <p className="text-sm font-semibold">{player.event}</p>}
                            {player.contry && <Image src={player.contry} alt={player.name} width={40} height={40} />}
                            <p className="text-lg font-bold">{player.name}</p>
                        </div>
                    )}
                    {player.photo && (
                        <Image
                            src={player.photo}
                            alt={player.name}
                            width={80}
                            height={80}
                            className={`rounded-full object-cover ${isRight ? "order-last" : ""}`}
                        />
                    )}
                    {!isRight && (
                        <div>
                            {event === "와일드카드" && <p className="text-sm font-semibold">{player.event}</p>}
                            {player.contry && <Image src={player.contry} alt={player.name} width={40} height={40} />}
                            <p className="text-lg font-bold">{player.name}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className={`flex items-center h-24 text-gray-500 ${isRight ? "justify-end" : "justify-center"}`}>
                    <p>선수 없음</p>
                </div>
            )}
        </div>
    );
}
function PlayerInfoRight({
    player,
    event,
    align = "left",
}: {
    player: Omit<FantasyPlayer, "id" | "year" | "ranking"> | null;
    event: string;
    align?: "left" | "right";
}) {
    const isRight = align === "right";
    return (
        <div className="flex-1">
            <h2 className={`text-xl font-semibold mb-2 mt-4 ${isRight ? "text-right" : ""}`}>
                {event === "와일드카드" ? "와일드카드" : event}
            </h2>
            {player ? (
                <div className={`flex items-center gap-4 ${isRight ? "justify-end" : ""}`}>
                    {isRight && (
                        <div className="text-right">
                            {event === "와일드카드" && <p className="text-sm font-semibold">{player.event}</p>}
                            {player.contry && <Image src={player.contry} alt={player.name} width={40} height={40} />}
                            <p className="text-lg font-bold">{player.name}</p>
                        </div>
                    )}
                    {!isRight && (
                        <div>
                            {event === "와일드카드" && <p className="text-sm font-semibold">{player.event}</p>}
                            {player.contry && <Image src={player.contry} alt={player.name} width={40} height={40} />}
                            <p className="text-lg font-bold">{player.name}</p>
                        </div>
                    )}
                    {player.photo && (
                        <Image
                            src={player.photo}
                            alt={player.name}
                            width={80}
                            height={80}
                            className={`rounded-full object-cover ${isRight ? "order-last" : ""}`}
                        />
                    )}
                </div>
            ) : (
                <div className={`flex items-center h-24 text-gray-500 ${isRight ? "justify-end" : "justify-center"}`}>
                    <p>선수 없음</p>
                </div>
            )}
        </div>
    );
}
export default async function RunningLeague({ params }: { params: PageParams }) {
    const leagueId = Number((await params).leagueId);

    // 사용자 정보를 가져옵니다.
    const user = await getUser();

    if (isNaN(leagueId) || !user) {
        return notFound();
    }

    const leagueData = await getLeague(leagueId);
    const teams = await getTeams(leagueId);

    // TODO: 리그 진행 상태(process)를 계산하는 로직이 필요합니다.
    const process = leagueData?.process;

    if (!leagueData) {
        return notFound();
    }

    // orderList의 첫 번째와 두 번째 userId
    const [firstUserId, secondUserId, thirdUserId, fourthUserId] = leagueData.orderList;

    // 각 userId에 해당하는 팀 찾기
    const firstTeam = teams.find((team) => team.userId === firstUserId);
    const secondTeam = teams.find((team) => team.userId === secondUserId);
    const thirdTeam = teams.find((team) => team.userId === thirdUserId);
    const fourthTeam = teams.find((team) => team.userId === fourthUserId);

    return (
        <div>
            {/* 페이지 상단 헤더 */}
            <header className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <Link href={`/fantasy/${user.id}`} className="flex items-center gap-2">
                    <Image src="/logo512.png" alt="Logo" width={40} height={40} />
                </Link>
                <span className="font-semibold">{process}</span>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">{leagueData.leagueName} - 리그 현황</h1>
                <div className="flex gap-8">
                    {/* 왼쪽 섹션 (팀1, 팀2) */}
                    <div className="w-1/2 flex gap-8">
                        {firstTeam && (
                            <div className="w-1/2 border rounded-lg p-4 shadow-md flex flex-col">
                                <h3 className="text-lg font-bold text-center mb-2">{firstTeam.user.nickName}의 팀</h3>
                                <div className="flex-1 flex flex-col">
                                    <PlayerInfoLeft player={firstTeam.ms} event="MS" />
                                    <PlayerInfoLeft player={firstTeam.ws} event="WS" />
                                    <PlayerInfoLeft player={firstTeam.md} event="MD" />
                                    <PlayerInfoLeft player={firstTeam.wd} event="WD" />
                                    <PlayerInfoLeft player={firstTeam.xd} event="XD" />
                                    <PlayerInfoLeft player={firstTeam.wc} event="와일드카드" />
                                </div>
                            </div>
                        )}
                        {secondTeam && (
                            <div className="w-1/2 border rounded-lg p-4 shadow-md flex flex-col">
                                <h3 className="text-lg font-bold text-center mb-2">{secondTeam.user.nickName}의 팀</h3>
                                <div className="flex-1 flex flex-col">
                                    <PlayerInfoRight player={secondTeam.ms} event="MS" align="right" />
                                    <PlayerInfoRight player={secondTeam.ws} event="WS" align="right" />
                                    <PlayerInfoRight player={secondTeam.md} event="MD" align="right" />
                                    <PlayerInfoRight player={secondTeam.wd} event="WD" align="right" />
                                    <PlayerInfoRight player={secondTeam.xd} event="XD" align="right" />
                                    <PlayerInfoRight player={secondTeam.wc} event="와일드카드" align="right" />
                                </div>
                            </div>
                        )}
                    </div>
                    {/* 오른쪽 섹션 (팀3, 팀4) */}
                    <div className="w-1/2 flex gap-8">
                        {thirdTeam && (
                            <div className="w-1/2 border rounded-lg p-4 shadow-md flex flex-col">
                                <h3 className="text-lg font-bold text-center mb-2">{thirdTeam.user.nickName}의 팀</h3>
                                <div className="flex-1 flex flex-col">
                                    <PlayerInfoLeft player={thirdTeam.ms} event="MS" />
                                    <PlayerInfoLeft player={thirdTeam.ws} event="WS" />
                                    <PlayerInfoLeft player={thirdTeam.md} event="MD" />
                                    <PlayerInfoLeft player={thirdTeam.wd} event="WD" />
                                    <PlayerInfoLeft player={thirdTeam.xd} event="XD" />
                                    <PlayerInfoLeft player={thirdTeam.wc} event="와일드카드" />
                                </div>
                            </div>
                        )}
                        {fourthTeam && (
                            <div className="w-1/2 border rounded-lg p-4 shadow-md flex flex-col">
                                <h3 className="text-lg font-bold text-center mb-2">{fourthTeam.user.nickName}의 팀</h3>
                                <div className="flex-1 flex flex-col">
                                    <PlayerInfoRight player={fourthTeam.ms} event="MS" align="right" />
                                    <PlayerInfoRight player={fourthTeam.ws} event="WS" align="right" />
                                    <PlayerInfoRight player={fourthTeam.md} event="MD" align="right" />
                                    <PlayerInfoRight player={fourthTeam.wd} event="WD" align="right" />
                                    <PlayerInfoRight player={fourthTeam.xd} event="XD" align="right" />
                                    <PlayerInfoRight player={fourthTeam.wc} event="와일드카드" align="right" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
