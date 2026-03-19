"use server";
import { redirect } from "next/navigation";
import getSession from "./session";
import { cookies } from "next/headers";

export const logout = async () => {
    const session = await getSession();
    session.destroy();

    // Safari 및 다른 개인정보 보호 브라우저와의 호환성을 위해 쿠키를 명시적으로 삭제합니다.
    (
        await // Safari 및 다른 개인정보 보호 브라우저와의 호환성을 위해 쿠키를 명시적으로 삭제합니다.
        cookies()
    ).set("session", "", {
        expires: new Date(0),
    });

    redirect("/");
};

export const logoutFromViewpage = async (clubId: Number) => {
    const session = await getSession();
    session.destroy();

    // Safari 및 다른 개인정보 보호 브라우저와의 호환성을 위해 쿠키를 명시적으로 삭제합니다.
    (
        await // Safari 및 다른 개인정보 보호 브라우저와의 호환성을 위해 쿠키를 명시적으로 삭제합니다.
        cookies()
    ).set("session", "", {
        expires: new Date(0),
    });
};
