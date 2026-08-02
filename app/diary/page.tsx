import { getClubDiary } from "@/lib/getClubDiary";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";

export default async function Home() {
    const user = await getUser();
    const clubData = await getClubDiary(user!.id);

    return (
        <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">내 클럽 목록</h1>
            <div className="w-full max-w-lg space-y-4">
                {clubData.map((club) => {
                    return (
                        <div
                            key={club.id}
                            className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                            <Link
                                href={`/diary/${user!.id}`}
                                className="text-xl font-semibold text-emerald-600 hover:underline"
                            >
                                {club.clubName}
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div className="mt-10">
                <Link href="/createClubDiary">
                    <span className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75 transition-all">
                        클럽 만들기
                    </span>
                </Link>
            </div>
        </div>
    );
}
