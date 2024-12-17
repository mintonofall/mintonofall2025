<<<<<<< HEAD
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();
  console.log(user);
  return (
    <div>
      <h1>Home {user?.userName}</h1>
      <Link href="/createClub">클럽생성</Link>
=======
import db from "@/lib/db";
import "@picocss/pico";
import getSession from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "../component/LogoutButton";

export default async function Home() {
  const logout = async () => {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  };
  async function getUser() {
    const session = await getSession();
    console.log(session);
    if (session.id) {
      const user = await db.user.findUnique({ where: { id: session.id } });
      return user;
    }
  }
  const user = await getUser();
  console.log("user : ", user);

  return (
    <div>
      <h1>welcome {user?.userName}</h1>
      <Link href={"/createClub"}>클럽만들기</Link>
      <form action={logout}>
        <button>Logout</button>
      </form>
>>>>>>> main
    </div>
  );
}
