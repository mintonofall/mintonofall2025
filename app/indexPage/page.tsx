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
        <div className="flex flex-col items-center space-y-4 p-4">
            <h1>어서오세요 {user?.userName} </h1>
            <Link href={"/home/"} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                게임진행판
            </Link>
            {/* <Link href={`/fantasy/${user!.id}`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                판타지 리그
            </Link> */}
            <Link href={`/diary/${user!.id}`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                일지작성
            </Link>
            <Link href={`/board`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                모두의민턴 게시판
            </Link>
            {/* <Link href={`/gametable/game-plan`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                개판 전국모임
            </Link> */}
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                Logout
            </button>
        </div>
    );
}
