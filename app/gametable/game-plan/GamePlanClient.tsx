"use client";

import { useState } from "react";
import Link from "next/link";
import GradeSelector from "./GradeSelector";

type DogPlayer = {
    id: number;
    name: string;
    where: string;
    grade: string;
    gameNum: number;
    gender: string;
};

interface GamePlanClientProps {
    dogPlayers: DogPlayer[];
    filterQuery: string;
    sort?: string;
}

export default function GamePlanClient({ dogPlayers, filterQuery, sort }: GamePlanClientProps) {
    // 1개의 코트, 각 코트는 4명의 선수 슬롯을 가짐 (null은 빈자리)
    const [courts, setCourts] = useState<(DogPlayer | null)[][]>(
        Array(1)
            .fill(null)
            .map(() => [null, null, null, null]),
    );

    // 현재 선택된 슬롯 위치 [코트인덱스, 슬롯인덱스]
    const [selectedSlot, setSelectedSlot] = useState<[number, number] | null>(null);

    // 코트의 슬롯을 클릭했을 때
    const handleSlotClick = (courtIdx: number, slotIdx: number) => {
        setSelectedSlot([courtIdx, slotIdx]);
    };

    // 하단 목록에서 선수를 클릭했을 때
    const handlePlayerClick = (player: DogPlayer) => {
        if (!selectedSlot) {
            alert("먼저 상단 코트에서 빈 자리를 선택해주세요.");
            return;
        }
        const [courtIdx, slotIdx] = selectedSlot;

        const newCourts = [...courts];
        newCourts[courtIdx] = [...newCourts[courtIdx]];
        newCourts[courtIdx][slotIdx] = player;
        setCourts(newCourts);

        // 다음 슬롯으로 자동 이동 (편의성)
        if (slotIdx < 3) {
            setSelectedSlot([courtIdx, slotIdx + 1]);
        } else {
            setSelectedSlot(null);
        }
    };

    // 코트에서 선수 제
    const handleRemovePlayer = (e: React.MouseEvent, courtIdx: number, slotIdx: number) => {
        e.stopPropagation(); // 슬롯 선택 이벤트 방지
        const newCourts = [...courts];
        newCourts[courtIdx] = [...newCourts[courtIdx]];
        newCourts[courtIdx][slotIdx] = null;
        setCourts(newCourts);
    };

    return (
        <div className="flex flex-col h-screen w-full">
            <div className="h-[50%] w-full bg-gray-100 flex flex-row">
                <div className="w-[70%] h-full p-4 flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-700 mb-2 text-center shrink-0">Game Table</h1>
                    <div className="flex-1 w-full h-full overflow-hidden">
                        {courts.map((court, courtIdx) => (
                            <div
                                key={courtIdx}
                                className="bg-green-600 p-4 rounded-lg shadow-lg relative w-full h-full flex flex-col"
                            >
                                <div className="absolute top-2 left-2 text-white font-bold text-xl opacity-50">
                                    Court {courtIdx + 1}
                                </div>
                                <div className="flex flex-col flex-1 gap-4 mt-8">
                                    {/* Team A */}
                                    <div className="flex gap-4 flex-1">
                                        {[0, 1].map((slotIdx) => (
                                            <div
                                                key={slotIdx}
                                                onClick={() => handleSlotClick(courtIdx, slotIdx)}
                                                className={`flex-1 bg-white/90 rounded flex flex-col items-center justify-center cursor-pointer relative transition-all
                                                ${selectedSlot?.[0] === courtIdx && selectedSlot?.[1] === slotIdx ? "ring-4 ring-yellow-400 scale-105 z-10" : "hover:bg-white"}
                                            `}
                                            >
                                                {court[slotIdx] ? (
                                                    <>
                                                        <span className="font-bold text-gray-800">
                                                            {court[slotIdx]!.name}
                                                        </span>
                                                        <span className="text-xs text-gray-600">
                                                            {court[slotIdx]!.grade}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleRemovePlayer(e, courtIdx, slotIdx)}
                                                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 font-bold px-1"
                                                        >
                                                            ×
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">선택</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Net */}
                                    <div className="h-2 bg-white/50 w-full rounded-full shrink-0"></div>
                                    {/* Team B */}
                                    <div className="flex gap-4 flex-1">
                                        {[2, 3].map((slotIdx) => (
                                            <div
                                                key={slotIdx}
                                                onClick={() => handleSlotClick(courtIdx, slotIdx)}
                                                className={`flex-1 bg-white/90 rounded flex flex-col items-center justify-center cursor-pointer relative transition-all
                                                ${selectedSlot?.[0] === courtIdx && selectedSlot?.[1] === slotIdx ? "ring-4 ring-yellow-400 scale-105 z-10" : "hover:bg-white"}
                                            `}
                                            >
                                                {court[slotIdx] ? (
                                                    <>
                                                        <span className="font-bold text-gray-800">
                                                            {court[slotIdx]!.name}
                                                        </span>
                                                        <span className="text-xs text-gray-600">
                                                            {court[slotIdx]!.grade}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleRemovePlayer(e, courtIdx, slotIdx)}
                                                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 font-bold px-1"
                                                        >
                                                            ×
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">선택</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-[30%] h-full border-l border-gray-300 bg-white p-4">
                    {/* Game Info Placeholder */}
                </div>
            </div>

            <div className="h-[50%] w-full bg-white p-4 border-t-2 border-gray-300 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2 text-sm items-center">
                        <GradeSelector />
                        <Link
                            href={`?sort=name${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${!sort || sort === "name" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            name
                        </Link>
                        <Link
                            href={`?sort=grade${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${sort === "grade" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            급수
                        </Link>
                        <Link
                            href={`?sort=gameNum_desc${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${sort === "gameNum_desc" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            게임많은
                        </Link>
                        <Link
                            href={`?sort=gameNum_asc${filterQuery}`}
                            className={`px-3 py-1 rounded-md border ${sort === "gameNum_asc" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                            게임적은
                        </Link>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">
                                    이름
                                </th>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                    지역
                                </th>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                    급수
                                </th>
                                <th className="px-6 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                                    게임수
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dogPlayers.map((player) => (
                                <tr
                                    key={player.id}
                                    onClick={() => handlePlayerClick(player)}
                                    className={`cursor-pointer ${player.gender === "man" ? "bg-blue-100" : player.gender === "woman" ? "bg-red-100" : "bg-white"} hover:opacity-80 transition-colors`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-800">
                                        {player.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600 font-medium">
                                        {player.where}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800 font-semibold">
                                        {player.grade}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-blue-600 font-bold">
                                        {player.gameNum}G
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
