"use client";
import { useFormState } from "react-dom";
// import handleClubCreate from "./action";
import "@picocss/pico";
export default function CreateClub() {
  // const [state, action] = useFormState(handleClubCreate, null);
  return (
    <div>
      <form className="flex flex-col items-center">
        <label htmlFor="clubname">클럽이름</label>
        <input
          type="text"
          id="clubname"
          placeholder="클럽이름"
          name="clubname"
        />
        <label htmlFor="location">장소</label>
        <input type="text" id="location" placeholder="장소" name="location" />
        <button type="submit">클럽생성</button>
      </form>
    </div>
  );
}
