
    "use server";
  
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { get } from "http";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

  export default async function handleLogin(prevState: any, formdata: FormData) {
    const userName = formdata.get("userName") as string;
    // 해당 유저가 있는지 확인
    const user = await db.user.findFirst({
      where: {
        userName,
      },
    });
    if(!user) {
        return {error: {uniqueUser : "해당 유저가 존재하지 않습니다."}}
    }
    // 비빌번호가 일치하는지 확인
    const password = formdata.get("password") as string;
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        console.log("로그인 성공");
        // 세션에 유저를 저장
        const cookie = await getIronSession(await cookies(),{
          cookieName: "session",
          password: process.env.COOKIE_PASSWORD!,
        })
        //@ts-ignore
        cookie.id = user.id;
       await cookie.save();
        redirect("/home");
      } else {
        console.log("비밀번호가 일치하지 않습니다.");
      return {error: {password: "비밀번호가 일치하지 않습니다."}}
      }
    // }
  };