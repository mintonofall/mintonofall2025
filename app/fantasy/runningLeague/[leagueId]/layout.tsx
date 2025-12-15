import Link from "next/link";
import Image from "next/image";
import { getLeague } from "@/app/actions";
import { getUser } from "@/lib/getUserGoHome";
export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ leagueId: string }>;
}) {
    const { leagueId } = await params;
    const leagueData = await getLeague(Number(leagueId));
    const process = leagueData?.process;
    const user = await getUser();

    return (
        <div className="relative min-h-screen">
            {/* 페이지 상단 헤더 */}
            <header className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <Link href={`/fantasy/${user!.id}`} className="flex items-center gap-2">
                    <Image src="/logo512.png" alt="Logo" width={40} height={40} />
                </Link>
                <span className="font-semibold">{process}</span>
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
