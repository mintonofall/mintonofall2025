"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/getUserGoHome";

export async function createFantasyLeague(formData: FormData) {
    const user = await getUser();
    if (!user?.id) {
        // 사용자가 로그인하지 않은 경우, 로그인 페이지로 리디렉션합니다.
        redirect("/log-in");
        return;
    }

    const data = {
        leagueName: formData.get("leagueName") as string,
        year: Number(formData.get("year")),
        process: "멤버 모집중", // 초기값으로 "멤버 모집중" 설정
    };

    if (!data.leagueName || !data.year) {
        // 간단한 유효성 검사
        return;
    }

    const league = await db.fantasyLeague.create({
        data: {
            ...data,
            participants: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    // 리그 생성 후 해당 리그 상세 페이지 또는 목록 페이지로 이동할 수 있습니다.
    redirect(`/fantasy/${league.id}`);
}
