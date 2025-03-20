import { getClubDiary } from "@/lib/getClubDiary";
import { getUser } from "@/lib/getUserGoHome";
import Link from "next/link";

export default async function Home() {
    const user = await getUser();
    const clubData = await getClubDiary(user!.id);

    return (
        <div>
            {clubData.map((club) => {
                return (
                    <div key={club.id}>
                        <Link href={`/diary/${club.id}`}>{club.clubName}</Link>
                    </div>
                );
            })}
        </div>
    );
}
