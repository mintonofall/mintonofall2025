import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();
  console.log(user);
  return (
    <div>
      <h1>Home {user?.userName}</h1>
      <Link href="/createClub">클럽생성</Link>
    </div>
  );
}
