import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import CompatibilityForm from "../CompatibilityForm";

export default async function GuhapWithPartnerPage({
    params,
}: {
    params: Promise<{ partnerUserName: string }>;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    const { partnerUserName } = await params;

    return (
        <CompatibilityForm
            userId={user.id}
            hasMbti={!!user.mbti}
            hasSaju={!!user.saju}
            initialPartnerUserName={partnerUserName}
        />
    );
}
