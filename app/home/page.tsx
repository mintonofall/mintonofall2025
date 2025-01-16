import db from "@/lib/db";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";
import { logout } from "@/lib/logout";

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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Home {user?.userName}</h1>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                Logout
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {club?.clubs.map((club) => (
                    <div key={club.id} className="bg-white shadow-md rounded p-4 flex justify-between w-full">
                        <Link href={`/home/${club.id}`}>
                            <h2 className="text-xl font-semibold">{club.clubName}</h2>
                        </Link>
                        <Link href={`createPlayer/${club.id}`}>
                            <span>선수등록</span>
                        </Link>
                    </div>
                ))}
            </div>
            <Link href="/createClub" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                클럽생성
            </Link>
        </div>
    );
}
