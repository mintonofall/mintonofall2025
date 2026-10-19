import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import GuestCompatibilityView from "./GuestCompatibilityView";

export default async function GuestCompatibilityPage() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return <GuestCompatibilityView userId={user.id} />;
}
