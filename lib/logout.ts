import { redirect } from "next/navigation";
import getSession from "./session";

export const logout = async () => {
  "use server";
  const session = await getSession();
  session.destroy();
  redirect("/");
};
