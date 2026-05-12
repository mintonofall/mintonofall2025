import db from "@/lib/db";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";
import { logout } from "@/lib/logout";
import { revalidatePath } from "next/cache";
import JoinClubForm from "./JoinClubForm";
import SearchableUnjoinedClubs from "./SearchableUnjoinedClubs";

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
                joinedClubs: true,
                pendingClubs: true,
            },
        });
        return clubList;
    };

    console.log(user);
    const club = await clubList();
    const joinedClubsList = club?.joinedClubs || [];
    const pendingClubsList = club?.pendingClubs || [];

    const unjoinedClubs = await db.club.findMany({
        where: user?.id
            ? {
                  NOT: {
                      OR: [
                          { users: { some: { id: user.id } } },
                          { joinedUsers: { some: { id: user.id } } },
                          { pendingUsers: { some: { id: user.id } } },
                      ],
                  },
              }
            : {},
    });
    console.log(club);

    // favoriteClub 배열 기준으로 정렬 (즐겨찾기 된 클럽들이 맨 위로)
    const favoriteClubs = club?.favoriteClub || [];
    const sortedJoinedClubsList = [...joinedClubsList].sort((a, b) => {
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

    const requestJoin = async (formData: FormData) => {
        "use server";
        if (!user?.id) return;
        const clubId = Number(formData.get("clubId"));

        await db.user.update({
            where: { id: user.id },
            data: {
                pendingClubs: {
                    connect: { id: clubId },
                },
            },
        });
        revalidatePath("/home");
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Home {user?.userName}</h1>
                <div className="flex items-center gap-3">
                    <Link
                        href="/board"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded font-medium transition"
                    >
                        자유게시판
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {club?.clubs.map((club) => (
                    <div key={club.id} className="bg-white shadow-md rounded p-4 flex justify-between items-center">
                        <Link href={`/home/${club.id}`}>
                            <h2 className="text-xl font-semibold">{club.clubName}</h2>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href={`/home/${club.id}/settings`} className="text-blue-500 hover:underline">
                                <span>클럽설정</span>
                            </Link>
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
                <h2 className="text-2xl font-bold mb-4">가입한 클럽</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedJoinedClubsList.map((c) => {
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
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">가입 신청 중인 클럽</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingClubsList.length > 0 ? (
                        pendingClubsList.map((c) => (
                            <div
                                key={c.id}
                                className="bg-gray-100 shadow-sm rounded p-4 flex justify-between items-center border border-gray-200"
                            >
                                <h2 className="text-xl font-semibold text-gray-500">{c.clubName}</h2>
                                <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                    대기 중
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">가입 신청 중인 클럽이 없습니다.</p>
                    )}
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">가입 가능한 클럽</h2>
                <SearchableUnjoinedClubs unjoinedClubs={unjoinedClubs} requestJoin={requestJoin} />
            </div>
            <Link href="/createClub" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                클럽생성
            </Link>
        </div>
    );
}
