import { redirect } from "next/navigation";
import db from "./db";
import getSession from "./session";

export async function getUser() {
    const session = await getSession();
    console.log(session);
    if (session.id) {
    redirect("/home");
    }
}

export async function logout() {
    const session = getSession();
    (await session).destroy();
}