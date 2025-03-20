import WaitPlayer from "./WaitPlayer";

export default function diary() {
    const fakeDB = ["김민준", "이서준", "박예준", "최지우", "정하윤", "강서연", "윤지호", "임도윤", "오하린", "서윤아"];
    return (
        <div>
            <h1>Diary</h1>
            <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
                <div style={{ flex: 7, backgroundColor: "#f0f0f0" }}>{/* Left section content */}</div>
                <div style={{ flex: 3, backgroundColor: "#d0d0d0" }}>
                    <WaitPlayer players={fakeDB} />
                    hello
                    {/* Right section content */}
                </div>
            </div>
        </div>
    );
}
