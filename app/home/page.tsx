import db from "@/lib/db";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";
import LogoutButton from "../component/LogoutButton";
import { logout } from "@/lib/logout";
import "@picocss/pico";

export default async function Home() {
    const user = await getUser();
    const clubList = async () => {
        const clubList = await db.user.findUnique({
            where: {
                id: user?.id,
            },
            include: {
                clubs: true,
            },
        });
        return clubList;
    };
    console.log(user);
    const club = await clubList();
    console.log(club);
    return (
        <div>
            <h1>Home {user?.userName}</h1>
            <button onClick={logout}>Logout</button>
            {club?.clubs.map((club) => (
                <div key={club.id}>
                    <Link href={`/home/${club.id}`}>
                        <h2>{club.clubName}</h2>
                    </Link>
                </div>
            ))}
            <Link href="/createClub">클럽생성</Link>
        </div>
    );
}
