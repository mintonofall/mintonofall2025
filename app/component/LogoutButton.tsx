"use client";

import { redirect, useRouter } from "next/navigation";
import  getSession from "@/lib/session";

export default async function LogoutButton() {
  const router = useRouter();
  const session = await getSession();
  function logout() {

  session.destroy();
  redirect("/");
  }
  return <button onClick={logout}>로그아웃</button>;
}