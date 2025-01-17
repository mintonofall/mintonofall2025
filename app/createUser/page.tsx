import handleSignup from "./action";
import { useActionState } from "react";

export default function SignupPage() {
    const [state, action] = useActionState(handleSignup, null);
    return (
        <form action={action} className="flex flex-col items-center max-w-screen-sm">
            <div>
                <label htmlFor="username">유저이름:</label>
                <input type="text" id="username" name="username" />
            </div>
            <div>
                <label htmlFor="password">패스워드:</label>
                <input type="password" id="password" name="password" required />
            </div>
            <div>
                <label htmlFor="passwordconfirm">패스워드확인:</label>
                <input type="password" id="passwordconfirm" name="passwordconfirm" required />
            </div>
            <button className="px-6" type="submit">
                가입신청
            </button>
            <span>{state?.error ?? ""}</span>
        </form>
    );
}
