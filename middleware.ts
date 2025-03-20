import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

export async function middleware(req: NextRequest) {
    const session = await getSession();
    if (req.nextUrl.pathname === "/") {
        if (session.id) {
            return NextResponse.redirect(new URL("/index", req.url));
        }
    }
}
