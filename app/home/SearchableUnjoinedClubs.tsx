"use client";

import { useState } from "react";
import JoinClubForm from "./JoinClubForm";

type Club = {
    id: number;
    clubName: string;
};

export default function SearchableUnjoinedClubs({
    unjoinedClubs,
    requestJoin,
}: {
    unjoinedClubs: Club[];
    requestJoin: (formData: FormData) => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClubs = unjoinedClubs.filter((club) =>
        club.clubName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div>
            <input
                type="text"
                placeholder="클럽 이름을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClubs.length > 0 ? (
                    filteredClubs.map((c) => (
                        <div key={c.id} className="bg-white shadow-md rounded p-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{c.clubName}</h2>
                            <JoinClubForm clubId={c.id} requestJoin={requestJoin} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">
                        {searchTerm ? "검색 결과가 없습니다." : "가입할 수 있는 클럽이 없습니다."}
                    </p>
                )}
            </div>
        </div>
    );
}
