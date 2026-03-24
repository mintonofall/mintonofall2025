import { getClub, getUser } from "@/lib/getUserGoHome";
import db from "@/lib/db";
import Link from "next/link";
import { logoutFromViewpage } from "@/lib/logout";

const MENU_ITEMS = [
    { label: "홈", href: "/", isLogin: false },
    { label: "내 클럽", href: "/home", isLogin: false },
    { label: "내 정보", href: "/mypage", isLogin: true },
    { label: "게임 보드", href: "/board", isLogin: true },
];

export default async function GameReview({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const clubId = Number(id);
    const club = await getClub(clubId);
    const user = await getUser();
    const isLoggedIn = !!user; // 유저 정보가 존재하면 true

    const visibleMenuItems = MENU_ITEMS.filter((item) => {
        return !item.isLogin || isLoggedIn;
    });

    // 1. 해당 클럽의 모든 경기 기록을 최신순으로 가져옵니다.
    const matches = await db.match.findMany({
        where: { clubid: clubId },
        select: { startTime: true },
        orderBy: { startTime: "desc" },
    });

    // 2. KST(한국 시간) 기준으로 'YYYY-MM-DD' 형태의 날짜만 추출하여 중복을 제거합니다.
    const dateSet = new Set<string>();
    matches.forEach((m) => {
        if (m.startTime) {
            const kstDate = new Date(m.startTime.getTime() + 9 * 60 * 60 * 1000);
            dateSet.add(kstDate.toISOString().split("T")[0]);
        }
    });
    const matchDates = Array.from(dateSet);

    return (
        <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50 pt-16">
            {/* 상단 유저 정보 및 로그아웃 버튼 */}
            {isLoggedIn && (
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
            )}
            <nav className="w-full max-w-4xl mb-8 border-b pb-4">
                <ul className="flex gap-6 justify-center">
                    {visibleMenuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="text-gray-600 hover:text-blue-500 font-medium transition-colors"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <h1 className="text-3xl font-bold text-blue-600 mb-8">
                {club?.clubName ? `${club.clubName} 환영합니다!` : `${clubId}번 클럽 환영합니다!`}
            </h1>
            <div className="w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">경기 기록 (날짜 선택)</h2>
                {matchDates.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {matchDates.map((date) => (
                            <Link
                                key={date}
                                href={`/home/${clubId}/gameReview/${date}`}
                                className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center font-bold text-gray-800 hover:text-blue-500"
                            >
                                {date}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-center py-8 bg-white rounded-lg border">
                        진행된 경기 기록이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
