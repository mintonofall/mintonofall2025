"use client";

import { ArrowTrendingUpIcon, ListBulletIcon, PencilSquareIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { use } from "react";
// import { useSearchParams } from "next/navigation";

export default function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ clubid: string }>;
}) {
    // const searchParams = useSearchParams();
    const { clubid } = use(params);
    console.log(clubid);

    return (
        // h-dvh(동적 뷰포트 높이)를 사용해 모바일 브라우저 주소창 등으로 화면이 짧아져도
        // 하단 탭 내비게이션이 항상 보이도록 합니다. 내용은 가운데 영역에서만 스크롤됩니다.
        <div className="h-dvh flex flex-col bg-gray-100">
            <div className="container mx-auto p-4 flex-1 min-h-0 overflow-y-auto">{children}</div>
            <div className="shrink-0 w-full flex justify-around bg-white py-3 border-t border-gray-300 shadow-lg">
                <Link href={`/diary/${clubid}`}>
                    <div className="text-center">
                        <PencilSquareIcon className="h-6 w-6 text-gray-700" />
                        <p className="text-gray-700 font-semibold">기록</p>
                    </div>
                </Link>
                <Link href={`/diary/${clubid}/result`}>
                    <div className="text-center">
                        <ListBulletIcon className="h-6 w-6 text-gray-700" />
                        <p className="text-gray-700 font-semibold">결과</p>
                    </div>
                </Link>
                <Link href={`/diary/${clubid}/stat`}>
                    <div className="text-center">
                        <ArrowTrendingUpIcon className="h-6 w-6 text-gray-700" />
                        <p className="text-gray-700 font-semibold">통계</p>
                    </div>
                </Link>
                <Link href={`/diary/${clubid}/players`}>
                    <div className="text-center">
                        <UsersIcon className="h-6 w-6 text-gray-700" />
                        <p className="text-gray-700 font-semibold">선수</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
