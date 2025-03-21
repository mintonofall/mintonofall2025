import Link from "next/link";

export default function Index() {
    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <Link href={"/home/"} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                게임진행판
            </Link>
            <Link href={"/diary/"} className="text-blue-500 hover:text-blue-700 font-semibold text-lg">
                일지작성
            </Link>
        </div>
    );
}
