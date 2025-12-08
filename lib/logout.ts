"use server";
import { redirect } from "next/navigation";
import getSession from "./session";

export const logout = async () => {
    const session = await getSession();
    session.destroy();
    await session.save(); // 세션 변경사항(파기)을 쿠키에 즉시 적용
    redirect("/");
};
