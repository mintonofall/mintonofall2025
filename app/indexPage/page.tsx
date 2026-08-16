import { getUser } from "@/lib/getUserGoHome";
import { logout } from "@/lib/logout";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-linear-to-b from-blue-50 via-white to-white px-4 py-10">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">
                어서오세요, {user?.userName}님 <span className="text-blue-500">🏸</span>
            </h1>
            <p className="text-slate-400 text-sm mb-8">오늘도 즐거운 배드민턴 되세요</p>

            <div className="flex flex-col w-full max-w-sm gap-3">
                <Link
                    href={"/home/"}
                    className="text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-3 rounded-full shadow-sm transition-colors"
                >
                    게임진행판
                </Link>
                {/* <Link href={`/fantasy/${user!.id}`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                판타지 리그
            </Link> */}
                <Link
                    href={`/diary/${user!.id}`}
                    className="text-center bg-white hover:bg-blue-50 text-slate-700 font-semibold text-lg py-3 rounded-full shadow-sm border border-blue-100 transition-colors"
                >
                    일지작성
                </Link>
                <Link
                    href={`/board`}
                    className="text-center bg-white hover:bg-blue-50 text-slate-700 font-semibold text-lg py-3 rounded-full shadow-sm border border-blue-100 transition-colors"
                >
                    모두의민턴 게시판
                </Link>
                <Link
                    href="https://iotofall.notion.site/doc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center bg-white hover:bg-blue-50 text-slate-700 font-semibold text-lg py-3 rounded-full shadow-sm border border-blue-100 transition-colors"
                >
                    사용설명서
                </Link>
                {/* <Link href={`/gametable/game-plan`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                개판 전국모임
            </Link> */}
                <form action={logout}>
                    <button
                        onClick={logout}
                        className="w-full text-center text-slate-400 hover:text-rose-500 font-medium py-2 mt-2 transition-colors"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
}
