export default function Login() {
    return (
        <div className="flex flex-row justify-evenly fixed top-0 w-full bg-gray-200 p-2 shadow-lg *:w-1/4">
            <input type="text" placeholder="username" name="userName" />
            <input type="password" placeholder="password" name="password" />
            <span> 가입</span>
        </div>
    );
}
