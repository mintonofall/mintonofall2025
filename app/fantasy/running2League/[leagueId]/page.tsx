import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { FantasyPlayer } from "@prisma/client";
import { getUser } from "@/lib/getUserGoHome";
import { getResult, type GameWithPlayers } from "@/lib/getResult";

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

function getDp(playerId: number, games: GameWithPlayers[]): number {
    const game = games.find((g) => g.player1Id === playerId);
    if (game) {
        const data = game.gameResult;
        if (data.length === 6) {
            const score = data[0] + data[2] + data[4] - data[1] - data[3] - data[5];
            return score;
        } else if (data.length === 4) {
            const score = data[0] + data[2] - data[1] - data[3];
            return score;
        }
    }
    const gameReverse = games.find((g) => g.player2Id === playerId);
    if (gameReverse) {
        const data = gameReverse.gameResult;
        if (data.length === 6) {
            const score = data[1] + data[3] + data[5] - data[0] - data[2] - data[4];
            return score;
        } else if (data.length === 4) {
            const score = data[0] + data[2] - data[1] - data[3];
            return score;
        }
    }
    return 0;
}

async function getTeams(leagueId: number) {
    const data = await db.fantasyTeam.findMany({
        where: { fantasyLeagueId: leagueId },
        include: {
            ms: {
                // 'msPlayer'는 FantasyTeam과 FantasyPlayer 모델 간의 관계 이름으로 가정합니다.
                select: {
                    id: true,
                    name: true,
                    contry: true,
                    photo: true,
                    event: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            ws: {
                select: {
                    id: true,
                    name: true,
                    contry: true,
                    photo: true,
                    event: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            md: {
                select: {
                    id: true,
                    name: true,
                    contry: true,
                    photo: true,
                    event: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            wd: {
                select: {
                    id: true,
                    name: true,
                    contry: true,
                    photo: true,
                    event: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            xd: {
                select: {
                    id: true,
                    name: true,
                    contry: true,
                    photo: true,
                    event: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            wc: {
                select: {
                    id: true,
                    name: true,
                    contry: true,
                    photo: true,
                    event: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            user: {
                // User 모델과의 관계를 통해 nickName을 가져옵니다.
                select: { nickName: true },
            },
        },
    });

    const games = await getResult("2024-12-12");

    const scoreMsData = data.map((p) => {
        const scores = getDp(p.ms!.id, games);
        console.log(scores);

        return { ...p, msScore: scores };
    });
    const scoreWsData = scoreMsData.map((p) => {
        const scores = getDp(p.ws!.id, games);
        console.log(scores);

        return { ...p, wsScore: scores };
    });
    const scoreMdData = scoreWsData.map((p) => {
        const scores = getDp(p.md!.id, games);
        console.log(scores);

        return { ...p, mdScore: scores };
    });
    const scoreWdData = scoreMdData.map((p) => {
        const scores = getDp(p.wd!.id, games);
        console.log(scores);

        return { ...p, wdScore: scores };
    });
    const scoreXdData = scoreWdData.map((p) => {
        const scores = getDp(p.xd!.id, games);
        console.log(scores);

        return { ...p, xdScore: scores };
    });
    const scoreWcData = scoreXdData.map((p) => {
        const scores = getDp(p.wc!.id, games);
        console.log(scores);

        return { ...p, wcScore: scores };
    });
    console.log("data : ", scoreWcData);

    return scoreWcData;
}

function PlayerInfoLeft({
    player,
    event,
    point,
    align = "left",
    result,
}: {
    player: Omit<FantasyPlayer, "id" | "year" | "ranking"> | null;
    event: string;
    point: number;
    align?: "left" | "right";
    result?: string;
}) {
    const isRight = align === "right";
    return (
        <div className="flex-1 w-full">
            <h2 className={`text-xl font-semibold mb-2 mt-4 ${isRight ? "text-right" : ""}`}>
                {event === "와일드카드" ? "와일드카드" : event}
            </h2>
            {player ? (
                <div className={`flex items-center gap-4 ${isRight ? "justify-between" : ""}`}>
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
                    <div className="ml-auto flex flex-col items-end">
                        <div className="font-bold text-xl">{point}</div>
                        {result && <div className="text-sm font-semibold">{result}</div>}
                    </div>
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
    point,
    result,
}: {
    player: Omit<FantasyPlayer, "id" | "year" | "ranking"> | null;
    event: string;
    align?: "left" | "right";
    point: number;
    result?: string;
}) {
    const isRight = align === "right";
    return (
        <div className="flex-1">
            <h2 className={`text-xl font-semibold mb-2 mt-4 ${isRight ? "text-right" : ""}`}>
                {event === "와일드카드" ? "와일드카드" : event}
            </h2>
            {player ? (
                <div className={`flex items-center gap-4 ${isRight ? "justify-end" : ""}`}>
                    <div className="mr-auto flex flex-col items-start">
                        <div className="font-bold text-xl">{point}</div>
                        {result && <div className="text-sm font-semibold">{result}</div>}
                    </div>
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

function getGameResult(myScore: number, otherScore: number) {
    if (myScore > otherScore) return "승";
    if (myScore < otherScore) return "패";
    return "무";
}

type TeamWithScores = {
    id: number;
    msScore: number;
    wsScore: number;
    mdScore: number;
    wdScore: number;
    xdScore: number;
    wcScore: number;
    firstRoundResult: string | null;
    secondRoundResult: string | null;
    thirdRoundResult: string | null;
};

async function getTeamStats(team: TeamWithScores | undefined, opponent: TeamWithScores | undefined, round: number) {
    if (!team || !opponent) return { win: 0, draw: 0, lose: 0, total: 0 };

    let win = 0;
    let draw = 0;
    let lose = 0;
    let total = 0;

    const scores = [
        [team.msScore, opponent.msScore],
        [team.wsScore, opponent.wsScore],
        [team.mdScore, opponent.mdScore],
        [team.wdScore, opponent.wdScore],
        [team.xdScore, opponent.xdScore],
        [team.wcScore, opponent.wcScore],
    ];

    scores.forEach(([my, other]) => {
        total += my;
        if (my > other) win++;
        else if (my < other) lose++;
        else draw++;
    });
    if (round === 1) {
        if (team.firstRoundResult === null && win > lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { firstRoundResult: "win" },
            });
        }
        if (team.firstRoundResult === null && win < lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { firstRoundResult: "lose" },
            });
        }
        if (team.firstRoundResult === null && win == lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { firstRoundResult: "draw" },
            });
        }
    }
    if (round === 2) {
        if (team.secondRoundResult === null && win > lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { secondRoundResult: "win" },
            });
        }
        if (team.secondRoundResult === null && win < lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { secondRoundResult: "lose" },
            });
        }
        if (team.secondRoundResult === null && win == lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { secondRoundResult: "draw" },
            });
        }
    }
    if (round === 3) {
        if (team.thirdRoundResult === null && win > lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { thirdRoundResult: "win" },
            });
        }
        if (team.thirdRoundResult === null && win < lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { thirdRoundResult: "lose" },
            });
        }
        if (team.thirdRoundResult === null && win == lose && draw !== 6) {
            await db.fantasyTeam.update({
                where: { id: team.id },
                data: { thirdRoundResult: "draw" },
            });
        }
    }

    return { win, draw, lose, total };
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

    if (!leagueData) {
        return notFound();
    }

    // orderList의 첫 번째와 두 번째 userId
    const [firstUserId, secondUserId, thirdUserId, fourthUserId] = leagueData.orderList;

    // 각 userId에 해당하는 팀 찾기
    const firstTeam = teams.find((team) => team.userId === firstUserId);
    const secondTeam = teams.find((team) => team.userId === thirdUserId);
    const thirdTeam = teams.find((team) => team.userId === secondUserId);
    const fourthTeam = teams.find((team) => team.userId === fourthUserId);

    const [team1Stats, team2Stats, team3Stats, team4Stats] = await Promise.all([
        getTeamStats(firstTeam, secondTeam, 2),
        getTeamStats(secondTeam, firstTeam, 2),
        getTeamStats(thirdTeam, fourthTeam, 2),
        getTeamStats(fourthTeam, thirdTeam, 2),
    ]);

    return (
        <div>
            {/* 메인 콘텐츠 */}
            <main className="p-8">
                <div className="flex gap-8">
                    {/* 왼쪽 섹션 (팀1, 팀2) */}
                    <div className="w-1/2 flex gap-8">
                        {firstTeam && (
                            <div className="w-1/2 border rounded-lg p-4 shadow-md flex flex-col">
                                <h3 className="text-lg font-bold text-center mb-2">{firstTeam.user.nickName}의 팀</h3>
                                <div className="flex-1 flex flex-col">
                                    <PlayerInfoLeft
                                        player={firstTeam.ms}
                                        event="MS"
                                        point={firstTeam.msScore}
                                        result={
                                            secondTeam
                                                ? getGameResult(firstTeam.msScore, secondTeam.msScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={firstTeam.ws}
                                        event="WS"
                                        point={firstTeam.wsScore}
                                        result={
                                            secondTeam
                                                ? getGameResult(firstTeam.wsScore, secondTeam.wsScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={firstTeam.md}
                                        event="MD"
                                        point={firstTeam.mdScore}
                                        result={
                                            secondTeam
                                                ? getGameResult(firstTeam.mdScore, secondTeam.mdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={firstTeam.wd}
                                        event="WD"
                                        point={firstTeam.wdScore}
                                        result={
                                            secondTeam
                                                ? getGameResult(firstTeam.wdScore, secondTeam.wdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={firstTeam.xd}
                                        event="XD"
                                        point={firstTeam.xdScore}
                                        result={
                                            secondTeam
                                                ? getGameResult(firstTeam.xdScore, secondTeam.xdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={firstTeam.wc}
                                        event="와일드카드"
                                        point={firstTeam.wcScore}
                                        result={
                                            secondTeam
                                                ? getGameResult(firstTeam.wcScore, secondTeam.wcScore)
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        {secondTeam && (
                            <div className="w-1/2 border rounded-lg p-4 shadow-md flex flex-col">
                                <h3 className="text-lg font-bold text-center mb-2">{secondTeam.user.nickName}의 팀</h3>
                                <div className="flex-1 flex flex-col">
                                    <PlayerInfoRight
                                        player={secondTeam.ms}
                                        event="MS"
                                        align="right"
                                        point={secondTeam!.msScore}
                                        result={
                                            firstTeam
                                                ? getGameResult(secondTeam!.msScore, firstTeam.msScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={secondTeam.ws}
                                        event="WS"
                                        align="right"
                                        point={secondTeam!.wsScore}
                                        result={
                                            firstTeam
                                                ? getGameResult(secondTeam!.wsScore, firstTeam.wsScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={secondTeam.md}
                                        event="MD"
                                        align="right"
                                        point={secondTeam!.mdScore}
                                        result={
                                            firstTeam
                                                ? getGameResult(secondTeam!.mdScore, firstTeam.mdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={secondTeam.wd}
                                        event="WD"
                                        align="right"
                                        point={secondTeam!.wdScore}
                                        result={
                                            firstTeam
                                                ? getGameResult(secondTeam!.wdScore, firstTeam.wdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={secondTeam.xd}
                                        event="XD"
                                        align="right"
                                        point={secondTeam!.xdScore}
                                        result={
                                            firstTeam
                                                ? getGameResult(secondTeam!.xdScore, firstTeam.xdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={secondTeam.wc}
                                        event="와일드카드"
                                        align="right"
                                        point={secondTeam.wcScore}
                                        result={
                                            firstTeam
                                                ? getGameResult(secondTeam!.wcScore, firstTeam.wcScore)
                                                : undefined
                                        }
                                    />
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
                                    <PlayerInfoLeft
                                        player={thirdTeam.ms}
                                        event="MS"
                                        point={thirdTeam.msScore}
                                        result={
                                            fourthTeam
                                                ? getGameResult(thirdTeam.msScore, fourthTeam.msScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={thirdTeam.ws}
                                        event="WS"
                                        point={thirdTeam.wsScore}
                                        result={
                                            fourthTeam
                                                ? getGameResult(thirdTeam.wsScore, fourthTeam.wsScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={thirdTeam.md}
                                        event="MD"
                                        point={thirdTeam.mdScore}
                                        result={
                                            fourthTeam
                                                ? getGameResult(thirdTeam.mdScore, fourthTeam.mdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={thirdTeam.wd}
                                        event="WD"
                                        point={thirdTeam.wdScore}
                                        result={
                                            fourthTeam
                                                ? getGameResult(thirdTeam.wdScore, fourthTeam.wdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={thirdTeam.xd}
                                        event="XD"
                                        point={thirdTeam.xdScore}
                                        result={
                                            fourthTeam
                                                ? getGameResult(thirdTeam.xdScore, fourthTeam.xdScore)
                                                : undefined
                                        }
                                    />
                                    <PlayerInfoLeft
                                        player={thirdTeam.wc}
                                        event="와일드카드"
                                        point={thirdTeam.wcScore}
                                        result={
                                            fourthTeam
                                                ? getGameResult(thirdTeam.wcScore, fourthTeam.wcScore)
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        {fourthTeam && (
                            <div className="w-1/2 border rounded-lg p-4 shadow-md flex flex-col">
                                <h3 className="text-lg font-bold text-center mb-2">{fourthTeam.user.nickName}의 팀</h3>
                                <div className="flex-1 flex flex-col">
                                    <PlayerInfoRight
                                        player={fourthTeam.ms}
                                        event="MS"
                                        align="right"
                                        point={fourthTeam.msScore}
                                        result={
                                            thirdTeam ? getGameResult(fourthTeam.msScore, thirdTeam.msScore) : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={fourthTeam.ws}
                                        event="WS"
                                        align="right"
                                        point={fourthTeam.wsScore}
                                        result={
                                            thirdTeam ? getGameResult(fourthTeam.wsScore, thirdTeam.wsScore) : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={fourthTeam.md}
                                        event="MD"
                                        align="right"
                                        point={fourthTeam.mdScore}
                                        result={
                                            thirdTeam ? getGameResult(fourthTeam.mdScore, thirdTeam.mdScore) : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={fourthTeam.wd}
                                        event="WD"
                                        align="right"
                                        point={fourthTeam.wdScore}
                                        result={
                                            thirdTeam ? getGameResult(fourthTeam.wdScore, thirdTeam.wdScore) : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={fourthTeam.xd}
                                        event="XD"
                                        align="right"
                                        point={fourthTeam.xdScore}
                                        result={
                                            thirdTeam ? getGameResult(fourthTeam.xdScore, thirdTeam.xdScore) : undefined
                                        }
                                    />
                                    <PlayerInfoRight
                                        player={fourthTeam.wc}
                                        event="와일드카드"
                                        align="right"
                                        point={fourthTeam.wcScore}
                                        result={
                                            thirdTeam ? getGameResult(fourthTeam.wcScore, thirdTeam.wcScore) : undefined
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex gap-8">
                    <div className="w-1/2 border rounded-lg p-6 shadow-md bg-gray-50">
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {team1Stats.win}승 {team1Stats.draw}무 {team1Stats.lose}패
                                </p>
                                <p className="text-gray-500 mt-1">총점: {team1Stats.total}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">
                                    {team2Stats.win}승 {team2Stats.draw}무 {team2Stats.lose}패
                                </p>
                                <p className="text-gray-500 mt-1">총점: {team2Stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 border rounded-lg p-6 shadow-md bg-gray-50">
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {team3Stats.win}승 {team3Stats.draw}무 {team3Stats.lose}패
                                </p>
                                <p className="text-gray-500 mt-1">총점: {team3Stats.total}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">
                                    {team4Stats.win}승 {team4Stats.draw}무 {team4Stats.lose}패
                                </p>
                                <p className="text-gray-500 mt-1">총점: {team4Stats.total}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
