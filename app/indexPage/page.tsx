import { getUser, logout } from "@/lib/getUserGoHome";
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
            <Link href={`/diary/${user!.id}`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                일지작성
            </Link>
            <Link href={`/fantasy/${user!.id}`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                판타지 리그
            </Link>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                Logout
            </button>
        </div>
    );
}
