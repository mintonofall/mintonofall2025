"use client";

import { useState } from "react";

type PlayerWithStats = {
    id: number;
    name: string;
    grade: string | null;
    gender: string | null;
    todayGameNum: number;
    where: string | null;
};

type DuoStat = {
    player1: { name: string; grade: string | null; gender: string | null } | undefined;
    player2: { name: string; grade: string | null; gender: string | null } | undefined;
    count: number;
};

type TrioStat = {
    player1: { name: string; grade: string | null; gender: string | null } | undefined;
    player2: { name: string; grade: string | null; gender: string | null } | undefined;
    player3: { name: string; grade: string | null; gender: string | null } | undefined;
    count: number;
};

type QuartetStat = {
    player1: { name: string; grade: string | null; gender: string | null } | undefined;
    player2: { name: string; grade: string | null; gender: string | null } | undefined;
    player3: { name: string; grade: string | null; gender: string | null } | undefined;
    player4: { name: string; grade: string | null; gender: string | null } | undefined;
    count: number;
};

export default function StatisticsClient({
    players = [],
    duoStats = [],
    trioStats = [],
    quartetStats = [],
}: {
    players?: PlayerWithStats[];
    duoStats?: DuoStat[];
    trioStats?: TrioStat[];
    quartetStats?: QuartetStat[];
}) {
    const [activeTab, setActiveTab] = useState("게임수");
    const [searchTerm, setSearchTerm] = useState("");
    const tabs = ["게임수", "2인", "3인", "4인"];

    const filteredPlayers = (players || []).filter((p) => p.name.includes(searchTerm));
    const filteredDuoStats = (duoStats || []).filter(
        (s) => s.player1?.name.includes(searchTerm) || s.player2?.name.includes(searchTerm),
    );
    const filteredTrioStats = (trioStats || []).filter(
        (s) =>
            s.player1?.name.includes(searchTerm) ||
            s.player2?.name.includes(searchTerm) ||
            s.player3?.name.includes(searchTerm),
    );
    const filteredQuartetStats = (quartetStats || []).filter(
        (s) =>
            s.player1?.name.includes(searchTerm) ||
            s.player2?.name.includes(searchTerm) ||
            s.player3?.name.includes(searchTerm) ||
            s.player4?.name.includes(searchTerm),
    );

    return (
        <div className="flex flex-col h-[calc(90vh-4rem)] w-full bg-gray-50">
            <div className="bg-white p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="선수 이름 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${
                                activeTab === tab
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === "게임수" ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        순위
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        이름
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        급수
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        게임수
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPlayers.map((player, index) => (
                                    <tr
                                        key={player.id}
                                        className={
                                            player.gender === "man"
                                                ? "bg-blue-50"
                                                : player.gender === "woman"
                                                  ? "bg-red-50"
                                                  : ""
                                        }
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {player.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                                            {player.grade}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-blue-600">
                                            {player.todayGameNum}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === "2인" ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        순위
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        팀 구성
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        게임수
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDuoStats.map((stat, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                                            <div className="flex justify-center items-center gap-2">
                                                <span
                                                    className={`font-bold ${stat.player1?.gender === "man" ? "text-blue-600" : stat.player1?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player1?.name}
                                                </span>
                                                <span className="text-gray-400">/</span>
                                                <span
                                                    className={`font-bold ${stat.player2?.gender === "man" ? "text-blue-600" : stat.player2?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player2?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-blue-600">
                                            {stat.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === "3인" ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        순위
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        조합 (3인)
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        게임수
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTrioStats.map((stat, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                                            <div className="flex justify-center items-center gap-2 flex-wrap">
                                                <span
                                                    className={`font-bold ${stat.player1?.gender === "man" ? "text-blue-600" : stat.player1?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player1?.name}
                                                </span>
                                                <span className="text-gray-400">/</span>
                                                <span
                                                    className={`font-bold ${stat.player2?.gender === "man" ? "text-blue-600" : stat.player2?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player2?.name}
                                                </span>
                                                <span className="text-gray-400">/</span>
                                                <span
                                                    className={`font-bold ${stat.player3?.gender === "man" ? "text-blue-600" : stat.player3?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player3?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-blue-600">
                                            {stat.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === "4인" ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        순위
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        조합 (4인)
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        게임수
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredQuartetStats.map((stat, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                                            <div className="flex justify-center items-center gap-2 flex-wrap">
                                                <span
                                                    className={`font-bold ${stat.player1?.gender === "man" ? "text-blue-600" : stat.player1?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player1?.name}
                                                </span>
                                                <span className="text-gray-400">/</span>
                                                <span
                                                    className={`font-bold ${stat.player2?.gender === "man" ? "text-blue-600" : stat.player2?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player2?.name}
                                                </span>
                                                <span className="text-gray-400">/</span>
                                                <span
                                                    className={`font-bold ${stat.player3?.gender === "man" ? "text-blue-600" : stat.player3?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player3?.name}
                                                </span>
                                                <span className="text-gray-400">/</span>
                                                <span
                                                    className={`font-bold ${stat.player4?.gender === "man" ? "text-blue-600" : stat.player4?.gender === "woman" ? "text-red-600" : "text-gray-800"}`}
                                                >
                                                    {stat.player4?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-blue-600">
                                            {stat.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        {activeTab} 통계 화면 (준비중)
                    </div>
                )}
            </div>
        </div>
    );
}
