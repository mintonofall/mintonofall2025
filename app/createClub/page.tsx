"use client";
// import handleClubCreate from "./action";
import "@picocss/pico";
import handleClubCreate from "./action";
import { useActionState } from "react";
export default function CreateClub() {
  const [state, action] = useActionState(handleClubCreate, null);
  return (
    <div>
      <form action={action} className="flex flex-col items-center">
        <label htmlFor="clubname">클럽이름</label>
        <input
          type="text"
          id="clubName"
          placeholder="클럽이름"
          name="clubName"
        />
        <label htmlFor="location">장소</label>
        <input
          type="text"
          id="location"
          placeholder="장소"
          name="clubLocation"
        />
        <button type="submit">클럽생성</button>
      </form>
    </div>
  );
}
