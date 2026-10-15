import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import { getCompatibilityHistory } from "@/lib/compatibility";
import CompatibilityForm from "./CompatibilityForm";

export default async function GuhapPage() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    const history = await getCompatibilityHistory(user.id);

    return (
        <CompatibilityForm
            userId={user.id}
            hasMbti={!!user.mbti}
            hasSaju={!!user.saju}
            hasStyle={!!user.style}
            initialHistory={history}
        />
    );
}
