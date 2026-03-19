"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function handleLogin(prevState: unknown, formdata: FormData) {
    const userName = formdata.get("userName") as string;
    const clubId = formdata.get("clubId") as string;
    // 해당 유저가 있는지 확인
    const user = await db.user.findFirst({
        where: {
            userName,
        },
    });
    if (!user) {
        return { error: { uniqueUser: "해당 유저가 존재하지 않습니다." } };
    }
    // 비빌번호가 일치하는지 확인
    const password = formdata.get("password") as string;
    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            console.log("로그인 성공");
            // 세션에 유저를 저장
            const cookie = await getIronSession(await cookies(), {
                cookieName: "session",
                password: process.env.COOKIE_PASSWORD!,
                cookieOptions: {
                    secure: process.env.NODE_ENV === "production", // 프로덕션에서는 true
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 프로덕션에서는 none, 개발에서는 lax
                    path: "/",
                },
            });
            // @ts-expect-error: Type 'number' is not assignable to type 'string'
            cookie.id = user.id;
            await cookie.save();
            redirect(`/home/${clubId}/viewPage`);
        } else {
            console.log("비밀번호가 일치하지 않습니다.");
        }
    }
}
