import Link from "next/link";
import { GUEST_PLAYER } from "@/lib/guestPlayer";

export default function GuestCompatibilityButton() {
    return (
        <Link
            href="/guhap/guest"
            className="flex items-center gap-3 w-full mb-8 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-colors"
        >
            <img
                src={GUEST_PLAYER.photo}
                alt={GUEST_PLAYER.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow shrink-0"
            />
            <span className="text-sm font-semibold text-indigo-700">
                특별게스트 {GUEST_PLAYER.name} 선수와 파트너를 한다면?
            </span>
        </Link>
    );
}
