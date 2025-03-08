import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div>{children}</div>
            <div className="flex flex-row justify-evenly fixed bottom-0 w-full bg-gray-200 p-4 shadow-lg *:w-1/4">
                <Link href="board">
                    <div className="flex-1 text-center">
                        <div className="px-4 py-2 bg-blue-500 text-white rounded">게임판</div>
                    </div>
                </Link>
                <Link href="waitPlayer">
                    <div className="flex-1 text-center">
                        <div className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">참가선수</div>
                    </div>
                </Link>
                <Link href="gameData">
                    <div className="flex-1 text-center">
                        <div className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">게임결과</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
