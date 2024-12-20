import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";
import { redirect } from "next/navigation";

export async function middleware(req: NextRequest) {
    const session = await getSession();
    if (req.nextUrl.pathname === "/") {
        if (session.id) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
    }
}
