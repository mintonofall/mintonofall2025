import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

export async function middleware(req: NextRequest) {
    const session = await getSession();
    console.log("session", session);
}
