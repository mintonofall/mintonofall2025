"use client";

import { FantasyPlayer } from "@prisma/client";
import Image from "next/image";

interface PlayerListPanelProps {
    groupedPlayers: Record<string, FantasyPlayer[]>;
}

export default function PlayerListPanel({ groupedPlayers }: PlayerListPanelProps) {
    return (
        <div className="w-3/5 flex flex-col bg-white h-screen">
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                {/* <h3 className="text-md font-bold mb-2">{league.leagueName} - 드래프트</h3> */}
                {/* <p className="text-xl text-gray-600">{league.year}년도 선수 목록</p> */}
            </div>
            <div className="flex-grow overflow-y-auto p-4">
                {Object.entries(groupedPlayers).map(([event, playersInEvent]) => (
                    <div key={event} className="mb-8">
                        {/* <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 sticky top-0 bg-white py-2">
                        {event}
                    </h2> */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {playersInEvent.map((player) => (
                                <div
                                    key={player.id}
                                    className="border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    {player.photo && (
                                        <div className="relative w-full h-20 mb-2 overflow-hidden rounded-md">
                                            <Image src={player.photo} alt={player.name} fill className="object-cover" />
                                        </div>
                                    )}
                                    <h3 className="text-md font-semibold">
                                        {player.name.includes("/")
                                            ? player.name.split("/").map((part, index) => (
                                                  <span key={index}>
                                                      {part.trim()}
                                                      {index < player.name.split("/").length - 1 && <br />}
                                                  </span>
                                              ))
                                            : player.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">랭킹: {player.ranking}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
