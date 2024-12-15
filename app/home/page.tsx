import db from "@/lib/db";
import '@picocss/pico'
import getSession from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
    async function getUser() {
        const session = await getSession();
console.log(session);
    if (session.id) {
        const user = await db.user.findUnique({ where: { id: session.id } });
        return user;
      }
    }
    const user =  await getUser();
    console.log("user : ",user);

    return (
        <div>
            <h1>welcome {user?.userName}</h1>
            <Link href={"/createClub"}>클럽만들기</Link>
            <button onClick={}>로그아웃</button>
          
        </div>
    )
}