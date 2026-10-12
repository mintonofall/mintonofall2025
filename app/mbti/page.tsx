import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import MbtiTest from "./MbtiTest";

export default async function MbtiPage() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return <MbtiTest userId={user.id} userName={user.userName} initialMbti={user.mbti} />;
}
