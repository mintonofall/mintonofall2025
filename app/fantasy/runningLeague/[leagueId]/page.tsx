import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";

type PageParams = { leagueId: string };

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
                select: { name: true, contry: true, photo: true },
            },
        },
    });

    return data;
}
export default async function RunningLeague({ params }: { params: PageParams }) {
    const leagueId = Number(params.leagueId);

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
    const firstUserId = leagueData.orderList[0];
    const secondUserId = leagueData.orderList[1];

    // 각 userId에 해당하는 팀 찾기
    const firstTeam = teams.find((team) => team.userId === firstUserId);
    const secondTeam = teams.find((team) => team.userId === secondUserId);

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
                <h1 className="text-2xl font-bold mb-6">{leagueData.leagueName} - 리그 현황</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {firstTeam?.ms && (
                        <div className="border rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold mb-2">MS</h2>
                            <div className="flex items-center gap-4">
                                {firstTeam.ms.photo && (
                                    <Image
                                        src={firstTeam.ms.photo}
                                        alt={firstTeam.ms.name}
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    {firstTeam.ms.contry && (
                                        <Image
                                            src={firstTeam.ms.contry}
                                            alt={firstTeam.ms.name}
                                            width={40}
                                            height={40}
                                        />
                                    )}

                                    <p className="text-lg font-bold">{firstTeam.ms.name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {secondTeam?.ms && (
                        <div className="border rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold mb-2 text-right">MS</h2>
                            <div className="flex items-center justify-end gap-4">
                                <div className="text-right">
                                    {secondTeam.ms.contry && (
                                        <Image
                                            src={secondTeam.ms.contry}
                                            alt={secondTeam.ms.name}
                                            width={40}
                                            height={40}
                                            className="ml-auto"
                                        />
                                    )}
                                    <p className="text-lg font-bold">{secondTeam.ms.name}</p>
                                </div>
                                {secondTeam.ms.photo && (
                                    <Image
                                        src={secondTeam.ms.photo}
                                        alt={secondTeam.ms.name}
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
