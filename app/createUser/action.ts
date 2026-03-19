"use server";

import db from "@/lib/db";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export default async function handleSignUp(pevState: unknown, formdata: FormData) {
    const username = formdata.get("username");
    const nickName = formdata.get("nickName");
    const password = formdata.get("password");
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
                    },
                });

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
