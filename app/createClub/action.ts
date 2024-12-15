"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
async function getUser() {
  const session = await getSession();
  console.log(session);
  if (session.id) {
    const user = await db.user.findUnique({ where: { id: session.id } });
    return user;
  }
}
export default async function handleClubCreate(prevState: any, formdata: FormData) {
const user = await getUser();
  const clubname = formdata.get("clubname") as string;
  const location = formdata.get("location") as string;
  const club = await db.club.create({
    data: {
      clubname,
      location,
      sissopId: user!.id,
    },
  })
  redirect("/home");
}