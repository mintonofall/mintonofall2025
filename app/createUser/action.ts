"use server";

import db from "@/lib/db";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { sendSlackNotification } from "@/lib/slack";

export default async function handleSignUp(pevState: unknown, formdata: FormData) {
    // 맥/일부 IME에서 한글이 자소분리(NFD)로 입력될 수 있어, 저장/조회 전에 정규화(NFC)합니다.
    const rawUsername = formdata.get("username");
    const username = typeof rawUsername === "string" ? rawUsername.normalize("NFC") : rawUsername;
    const nickName = formdata.get("nickName");
    const password = formdata.get("password");

    // 아이디는 영문/숫자/언더바만 허용합니다 (한글 아이디는 일부 환경에서 로그인 시 자소분리 문제가 생길 수 있어요).
    if (typeof username !== "string" || !/^[A-Za-z0-9_]+$/.test(username)) {
        return { error: "아이디는 영문, 숫자, _(언더바)만 사용할 수 있습니다." };
    }

    // Check if the user already exists
    const user = await db.user.findFirst({
        where: {
            userName: username as string,
        },
    });
    if (user) {
        console.log("이미 존재하는 유저입니다.");
        return { error: "이미 존재하는 유저입니다." };
    }

    // Check if the password and passwordconfirm are the same
    if (password !== formdata.get("passwordconfirm")) {
        console.log("패스워드가 일치하지 않습니다.");
        return;
    }
    // bcrypt the password
    if (typeof nickName === "string") {
        if (typeof password === "string") {
            if (typeof username === "string") {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await db.user.create({
                    data: {
                        userName: username,
                        password: hashedPassword,
                        nickName,
                        favoriteClub: [], // favoriteClub 필드에 빈 배열을 명시적으로 제공합니다.
                    },
                });
                await sendSlackNotification(`🎉 ${newUser.userName} 님이 방금 가입하셨습니다!`);

                // 가입 성공 후 자동 로그인(세션 저장)
                const cookie = await getIronSession(await cookies(), {
                    cookieName: "session",
                    password: process.env.COOKIE_PASSWORD!,
                    cookieOptions: {
                        secure: process.env.NODE_ENV === "production",
                        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                        path: "/",
                    },
                });
                // @ts-expect-error: Type 'number' is not assignable to type 'string'
                cookie.id = newUser.id;
                await cookie.save();
            }
        }
    } else {
        console.log("Invalid password");
        return;
    }

    const clubId = formdata.get("clubId");
    if (clubId) {
        redirect(`/home/${clubId}/viewPage`);
    }

    redirect("/"); // Redirect to the home page
}
