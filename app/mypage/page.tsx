import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import MyInfoForm from "./MyInfoForm";
import type { SajuResult } from "@/lib/sajuTypes";

export default async function MyPage() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <MyInfoForm
            userName={user.userName}
            nickName={user.nickName}
            point={user.point}
            mbti={user.mbti}
            saju={(user.saju as SajuResult | null) ?? null}
        />
    );
}
