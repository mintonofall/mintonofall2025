"use client";
import Image from "next/image";
import handleLogin from "./action";
import '@picocss/pico'
import db from "@/lib/db";
import Link from "next/link";
import { useActionState } from "react";
import {getUser} from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";

export default async function Home() {
  const [state, action] = useActionState(handleLogin, null);
  const isUser = await getUser();
  return (
  <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <Image src="/logo512.png" alt="Vercel Logo" width={512} height={512} />
    <form action={action}>
      <label htmlFor="username">username</label>
      <input id="username" name="userName" type="text"/>
      <span className="text-red-600 ">{state?.error?.uniqueUser ?? ""}</span>
      <label htmlFor="password">password</label>
      <input id="password" name="password" type="text"/>
      <span className="text-red-600">{state?.error?.password ?? ""}</span>
      <button type="submit">로그인</button>
    </form>
    <Link href={"/createUser"}>가입하기</Link>
  </div>
  );
}
