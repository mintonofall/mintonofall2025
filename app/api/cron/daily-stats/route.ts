import db from "@/lib/db";
import { sendSlackNotification } from "@/lib/slack";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userCount, clubCount, playerCount, matchCount] = await Promise.all([
        db.user.count(),
        db.club.count(),
        db.player.count(),
        db.match.count(),
    ]);

    const today = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date());

    await sendSlackNotification(
        `📊 ${today} 일일 통계\n` +
            `- 유저 수: ${userCount}명\n` +
            `- 클럽 수: ${clubCount}개\n` +
            `- 플레이어 수: ${playerCount}명\n` +
            `- 매치 수: ${matchCount}건`,
    );

    return NextResponse.json({ userCount, clubCount, playerCount, matchCount });
}
