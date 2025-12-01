"use server";

import db from "@/lib/db";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/getUserGoHome";

export async function joinLeague(formData: FormData) {
    const user = await getUser();
    const leagueId = Number(formData.get("leagueId"));
    if (!leagueId) {
        return;
    }

    if (!user) {
        return redirect("/log-in");
    }

    await db.$transaction(async (tx) => {
        await tx.fantasyLeague.update({
            where: {
                id: leagueId,
            },
            data: {
                participants: {
                    connect: { id: user.id },
                },
            },
        });

        const league = await tx.fantasyLeague.findUnique({
            where: { id: leagueId },
            include: { _count: { select: { participants: true } } },
        });

        if (league && league._count.participants >= 4) {
            await tx.fantasyLeague.update({
                where: { id: leagueId },
                data: { process: "드래프트 순서정하기" },
            });
        }
    });

    revalidatePath("/fantasy/[userid]");
}

export async function logout() {
    const session = await getIronSession(await cookies(), {
        cookieName: "session",
        password: process.env.COOKIE_PASSWORD!,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
        },
    });
    if (session) {
        session.destroy();
    }

    redirect("/");
}
