import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/lib/getUserGoHome";
export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ leagueId: string }>;
}) {
    const { leagueId } = await params;
    const user = await getUser();

    return (
        <div className="relative min-h-screen">
            {/* 페이지 상단 헤더 */}
            <header className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <Link href={`/fantasy/${user!.id}`} className="flex items-center gap-2">
                    <Image src="/logo512.png" alt="Logo" width={40} height={40} />
                </Link>
                <div className="flex gap-2">
                    <Link href={`/fantasy/runningLeague/${leagueId}`} className="text-center">
                        <div className="px-3 py-2 bg-gray-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm">
                            1ROUND
                        </div>
                    </Link>
                    <Link href={`/fantasy/running2League/${leagueId}`} className="text-center">
                        <div className="px-3 py-2 bg-gray-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm">
                            2ROUND
                        </div>
                    </Link>
                    <Link href={`/fantasy/running3League/${leagueId}`} className="text-center">
                        <div className="px-3 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm">
                            3ROUND
                        </div>
                    </Link>
                    <Link href={`/fantasy/leagueResult/${leagueId}`} className="text-center">
                        <div className="px-3 py-2 bg-gray-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm">
                            최종성적
                        </div>
                    </Link>
                </div>
            </header>
            <div className="pb-24">{children}</div>
            <div className="flex flex-row justify-evenly fixed bottom-0 w-full bg-gray-200 p-4 shadow-lg z-50">
                <Link href={`/fantasy/runningLeague/${leagueId}`} className="flex-1 text-center">
                    <div className="mx-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors">
                        판타지 리그
                    </div>
                </Link>
                <Link href={`/fantasy/runningLeague/${leagueId}/result`} className="flex-1 text-center">
                    <div className="mx-2 px-4 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">
                        경기 결과
                    </div>
                </Link>
            </div>
        </div>
    );
}
