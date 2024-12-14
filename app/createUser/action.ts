
    "use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

  export default async function handleSignUp(pevState: any, formdata: FormData) {
    const username = formdata.get("username");
    const password = formdata.get("password");
    // Check if the user already exists
    const user = await db.user.findFirst({
      where: {
        userName: username as string,
      },
    });
    if (user) {
      console.log("이미 존재하는 유저입니다.");
      return { error: "이미 존재하는 유저입니다." };
    }

    // Check if the password and passwordconfirm are the same
    if (password !== formdata.get("passwordconfirm")) {
      console.log("패스워드가 일치하지 않습니다.");
      return;
    }
    // bcrypt the password
    if (typeof password === "string") {
      if (typeof username === "string") {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.create({
          data: {
            userName: username,
            password: hashedPassword,
          },
        });
      }
    } else {
      console.log("Invalid password");
      return;
    }
    // Save the user to the database
    redirect("/"); // Redirect to the home page
  };