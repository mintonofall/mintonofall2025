"use client";

import { ArrowTrendingUpIcon, ListBulletIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { use } from "react";
// import { useSearchParams } from "next/navigation";

export default function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ clubid: number }>;
}) {
    // const searchParams = useSearchParams();
    const { clubid } = use(params);
    console.log(clubid);

    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">{children}</div>
            <div className="fixed bottom-0 w-full flex justify-around bg-white py-4 border-t border-gray-300 shadow-lg">
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
            </div>
        </div>
    );
}
