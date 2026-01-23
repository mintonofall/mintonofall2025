"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`${pathname}?search=${encodeURIComponent(search.trim())}`);
        } else {
            router.push(pathname);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2 justify-center max-w-md mx-auto">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="선수 이름 검색"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-bold whitespace-nowrap"
            >
                검색
            </button>
        </form>
    );
}
