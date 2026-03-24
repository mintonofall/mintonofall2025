import { Menus } from "@/lib/gameReviewMenu";
import Link from "next/link";
import { getUser } from "@/lib/getUserGoHome";
import { logoutFromViewpage } from "@/lib/logout";
import { loginAndRevalidate } from "@/app/action";
import db from "@/lib/db";

export default async function GameReviewDatePage({ params }: { params: Promise<{ id: string; date: string }> }) {
    const { id, date } = await params;
    const clubId = Number(id);
    const user = await getUser();
    const isLoggedIn = !!user; // 유저 정보가 존재하면 true

    const visibleMenus = Menus.filter((menu) => !menu.isLogin || isLoggedIn);

    // 공통 함수에 현재 페이지의 URL을 미리 바인딩합니다.
    const loginAction = loginAndRevalidate.bind(null, `/home/${id}/gameReview/${date}`);

    // 해당 날짜의 경기 수와 참여 플레이어 수 계산
    const dayStart = new Date(`${date}T00:00:00+09:00`);
    const dayEnd = new Date(`${date}T23:59:59.999+09:00`);

    const matchesOnDate = await db.match.findMany({
        where: {
            clubid: clubId,
            endTime: {
                gte: dayStart,
                lt: dayEnd,
            },
        },
        select: { player1id: true, player2id: true, player3id: true, player4id: true },
    });

    const matchCount = matchesOnDate.length;
    const uniquePlayers = new Set<number>();
    matchesOnDate.forEach((match) => {
        [match.player1id, match.player2id, match.player3id, match.player4id].forEach((pid) => {
            if (pid) uniquePlayers.add(pid);
        });
    });
    const playerCount = uniquePlayers.size;

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            {/* 상단 유저 정보 및 로그아웃 버튼 */}
            {isLoggedIn ? (
                <div className="w-full max-w-4xl flex justify-end items-center mb-4 gap-3">
                    <span className="font-semibold text-gray-700">{user.nickName || user.userName}님</span>
                    <form
                        action={async () => {
                            "use server";
                            await logoutFromViewpage(clubId);
                        }}
                    >
                        <button
                            type="submit"
                            className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-sm font-semibold py-1 px-3 rounded transition-colors"
                        >
                            로그아웃
                        </button>
                    </form>
                </div>
            ) : (
                <div className="w-full max-w-4xl flex justify-end items-center mb-4">
                    <form action={loginAction} className="flex items-center gap-2">
                        <input
                            type="text"
                            name="username"
                            placeholder="아이디"
                            required
                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            required
                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded transition-colors"
                        >
                            로그인
                        </button>
                    </form>
                </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mb-8 gap-4">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-blue-600">{date} 경기 통계 및 리뷰</h1>
                    <p className="text-sm text-gray-600 font-semibold">
                        총 경기 수: <span className="text-blue-500">{matchCount}</span> | 참여 인원:{" "}
                        <span className="text-blue-500">{playerCount}</span>명
                    </p>
                </div>
                <Link
                    href={`/home/${clubId}/gameReview`}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                    돌아가기
                </Link>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleMenus.map((menu, index) => {
                    // menu.url이 "/[id]/manyGame" 형태로 되어 있으므로,
                    // 뒤의 경로명("/manyGame")만 추출하여 현재 날짜의 하위 경로로 연결합니다.
                    const targetPath = menu.url.replace("/[id]", "");

                    return (
                        <Link
                            key={index}
                            href={`/home/${id}/gameReview/${date}${targetPath}`}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border flex flex-col gap-2 group"
                        >
                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-500 transition-colors">
                                {menu.title}
                            </h2>
                            <p className="text-sm text-gray-500">{menu.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
