import db from "@/lib/db";
import Link from "next/link";

export default async function NoUserClubList() {
    const clubs = async () => {
        const clubs = await db.club.findMany({});
        return clubs;
    };
    const clubsList = await clubs();
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">All Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubsList.map((club) => {
                    return (
                        <div key={club.id} className="bg-white shadow-md rounded p-4">
                            <Link href={club.id + "/board/"}>
                                <h1 className="text-xl font-semibold text-blue-500 hover:underline">{club.clubName}</h1>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
