import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import SajuForm from "./SajuForm";
import type { SajuResult } from "@/lib/sajuTypes";

export default async function SajuPage() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <SajuForm userId={user.id} userName={user.userName} initialResult={(user.saju as SajuResult | null) ?? null} />
    );
}
