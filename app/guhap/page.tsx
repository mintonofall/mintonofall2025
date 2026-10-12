import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import CompatibilityForm from "./CompatibilityForm";

export default async function GuhapPage() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <CompatibilityForm
            userId={user.id}
            hasMbti={!!user.mbti}
            hasSaju={!!user.saju}
        />
    );
}
