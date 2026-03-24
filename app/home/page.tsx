import db from "@/lib/db";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";
import { logout } from "@/lib/logout";
import { revalidatePath } from "next/cache";

export default async function Home() {
    const user = await getUser();
    const clubList = async () => {
        if (!user?.id) return null;
        const clubList = await db.user.findUnique({
            where: {
                id: user.id,
            },
            include: {
                clubs: true,
            },
        });
        return clubList;
    };
    const clubs = async () => {
        const clubs = await db.club.findMany({});
        return clubs;
    };

    console.log(user);
    const club = await clubList();
    const clubsList = await clubs();
    console.log(club);

    // favoriteClub 배열 기준으로 정렬 (즐겨찾기 된 클럽들이 맨 위로)
    const favoriteClubs = club?.favoriteClub || [];
    const sortedClubsList = [...clubsList].sort((a, b) => {
        const aFav = favoriteClubs.includes(a.id);
        const bFav = favoriteClubs.includes(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });

    const toggleFavorite = async (formData: FormData) => {
        "use server";
        if (!user?.id) return;
        const clubId = Number(formData.get("clubId"));
        const isCurrentlyFav = formData.get("isFavorite") === "true";

        const currentUser = await db.user.findUnique({
            where: { id: user.id },
            select: { favoriteClub: true },
        });

        const currentFavs = currentUser?.favoriteClub || [];
        const newFavs = isCurrentlyFav ? currentFavs.filter((id: number) => id !== clubId) : [...currentFavs, clubId];

        await db.user.update({
            where: { id: user.id },
            data: {
                favoriteClub: newFavs,
            },
        });
        revalidatePath("/home");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Home {user?.userName}</h1>
            <form action={logout}>
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                    Logout
                </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {club?.clubs.map((club) => (
                    <div key={club.id} className="bg-white shadow-md rounded p-4 flex justify-between items-center">
                        <Link href={`/home/${club.id}`}>
                            <h2 className="text-xl font-semibold">{club.clubName}</h2>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href={`/home/${club.id}/gameReview`} className="text-blue-500 hover:underline">
                                <span>게임리뷰</span>
                            </Link>
                            <Link href={`playerList/${club.id}`} className="text-blue-500 hover:underline">
                                <span>선수목록</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">All Clubs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedClubsList.map((c) => {
                        const isFavorite = favoriteClubs.includes(c.id);
                        return (
                            <div
                                key={c.id}
                                className="bg-white shadow-md rounded p-4 flex justify-between items-center"
                            >
                                <Link href={"/home/" + c.id + "/viewPage/"}>
                                    <h1 className="text-xl font-semibold text-blue-500 hover:underline">
                                        {c.clubName}
                                    </h1>
                                </Link>
                                <div className="flex items-center gap-4">
                                    <Link href={`/home/${c.id}/gameReview`} className="text-blue-500 hover:underline">
                                        <span>게임리뷰</span>
                                    </Link>
                                    <form action={toggleFavorite}>
                                        <input type="hidden" name="clubId" value={c.id} />
                                        <input type="hidden" name="isFavorite" value={isFavorite.toString()} />
                                        <button type="submit" className="text-yellow-500 text-2xl focus:outline-none">
                                            {isFavorite ? "★" : "☆"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Link href="/createClub" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                클럽생성
            </Link>
        </div>
    );
}
