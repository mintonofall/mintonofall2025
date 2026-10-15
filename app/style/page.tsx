import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import StyleTest from "./StyleTest";
import type { StyleResult } from "@/lib/styleTypes";

export default async function StylePage() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <StyleTest
            userId={user.id}
            userName={user.userName}
            initialResult={(user.style as StyleResult | null) ?? null}
        />
    );
}
