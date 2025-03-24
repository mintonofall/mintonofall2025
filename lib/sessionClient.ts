"use server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

export default async function getSessionClient() {
    const session = await getIronSession<SessionContent>(await cookies(), {
        cookieName: "session",
        password: process.env.COOKIE_PASSWORD!,
    });
    if (session) {
        return {
            id: session.id,
        };
    }
}
