import { getUser } from "@/lib/getUserGoHome";
import { logout } from "@/lib/logout";
import Link from "next/link";
import { redirect } from "next/navigation";
import MyQrCode from "./MyQrCode";
import { ELEMENT_STYLE, type SajuResult } from "@/lib/sajuTypes";
import type { StyleResult } from "@/lib/styleTypes";
import GuestCompatibilityButton from "@/app/guhap/GuestCompatibilityButton";

export default async function Index() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    const saju = user.saju as SajuResult | null;
    const sajuSummary = saju
        ? [ELEMENT_STYLE[saju.baseElement].style, saju.zodiac].filter(Boolean).join(" · ")
        : null;
    const style = user.style as StyleResult | null;
    const styleSummary = style ? "측정완료" : null;

    return (
        <div className="relative flex flex-col items-center space-y-4 p-4">
            <Link
                href={`/mypage`}
                className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 font-semibold"
            >
                마이페이지
            </Link>
            <h1>어서오세요 {user?.userName} </h1>
            <div className="flex flex-col items-stretch gap-4 w-64 sm:w-72">
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
                <div className="flex items-center justify-between">
                    <Link href={`/mbti`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                        배드민턴 MBTI 테스트
                    </Link>
                    <span className={`text-sm ${user.mbti ? "text-gray-600 font-semibold" : "text-amber-500"}`}>
                        {user.mbti ?? "확인해 보세요"}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <Link href={`/saju`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                        민턴사주
                    </Link>
                    <span className={`text-sm ${sajuSummary ? "text-gray-600 font-semibold" : "text-amber-500"}`}>
                        {sajuSummary ?? "확인해 보세요"}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <Link href={`/style`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                        민턴스타일
                    </Link>
                    <span className={`text-sm ${styleSummary ? "text-gray-600 font-semibold" : "text-amber-500"}`}>
                        {styleSummary ?? "확인해 보세요"}
                    </span>
                </div>
                <Link href={`/guhap`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                    민턴궁합
                </Link>
                <GuestCompatibilityButton />
                <MyQrCode userName={user!.userName} />
                <Link
                    href="https://iotofall.notion.site/doc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-semibold text-lg"
                >
                    사용설명서
                </Link>
                {/* <Link href={`/gametable/game-plan`} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                    개판 전국모임
                </Link> */}
            </div>
            <form action={logout}>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                    Logout
                </button>
            </form>
        </div>
    );
}
