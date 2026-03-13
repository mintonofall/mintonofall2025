"use client";

/**
 * @file /app/component/GameCourt.tsx
 * @description 개별 게임 코트의 상태를 표시하고, 경기 종료 및 승자 선택 기능을 제공하는 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 * @note 현재 메인 대시보드에서는 LeftTopSection 내부의 간소화된 코트 UI를 사용하며, 이 컴포넌트는 다른 페이지나 이전 버전에서 사용될 수 있습니다.
 */
import { endMatch } from "@/lib/getUserGoHome";
import Image from "next/image";
import { useState } from "react";
import { Player } from "@/lib/interface";

/**
 * GameCourt 컴포넌트의 props 인터페이스
 * @interface gameplayers
 * @property {Player} p1 - 플레이어 1 정보
 * ... (p2, p3, p4)
 */
interface gameplayers {
    p1: Player;
    p2: Player;
    p3: Player;
    p4: Player;
    clubid: number;
    court: number;
    gameid: string;
    onEndMatch: () => void;
    onWinsUp: (winner: number[]) => void;
}

/**
 * 개별 게임 코트 컴포넌트
 */
export default function GameCourt({ p1, p2, p3, p4, court, gameid, onEndMatch, onWinsUp }: gameplayers) {
    /** @type {boolean} 경기 결과(승자 선택) 모달 표시 여부 상태 */
    const [isShowResult, setIsShowResult] = useState(false);
    /** @type {number[]} 승자로 선택된 선수의 인덱스(1-4)를 저장하는 배열 */
    const [winnerpoint, setWinnerpoint] = useState<number[]>([]);

    // 각 플레이어의 아바타 URL 처리 (기본 이미지 포함)
    const player1Avatar = p1?.avater?.startsWith("https://imagedelivery.net/")
        ? `${p1.avater}/avatar`
        : p1?.avater || "/guest.png";
    const player2Avatar = p2?.avater?.startsWith("https://imagedelivery.net/")
        ? `${p2.avater}/avatar`
        : p2?.avater || "/guest.png";
    const player3Avatar = p3?.avater?.startsWith("https://imagedelivery.net/")
        ? `${p3.avater}/avatar`
        : p3?.avater || "/guest.png";
    const player4Avatar = p4?.avater?.startsWith("https://imagedelivery.net/")
        ? `${p4.avater}/avatar`
        : p4?.avater || "/guest.png";
    console.log(court);

    /**
     * 경기 종료 로직을 처리하는 함수. DB에 경기 결과를 업데이트합니다.
     * @param {string} gameid - 종료할 경기의 ID
     * @param {number[]} winner - 승리한 선수의 인덱스(1-4) 배열
     */
    const endMatchFunction = async (gameid: string, winner: number[]) => {
        const players = [p1, p2, p3, p4];
        console.log("endMatchFunction", players);
        let newWinners: number[] = [];
        if (winner.length !== 0) {
            const newwinner1: number = players[winner[0] - 1].id;
            const newwinner2: number = players[winner[1] - 1].id;
            newWinners = [newwinner1, newwinner2];
        }
        onWinsUp(newWinners);
        await endMatch(gameid, newWinners);
    };

    /**
     * 승자 선택 모달에서 플레이어를 클릭했을 때 호출되는 함수를 반환하는 고차 함수.
     * @param {number} winner - 클릭된 플레이어의 인덱스 (1-4)
     */
    function selectWinner(winner: number) {
        return function () {
            console.log("Winner is:", winner);
            if (winnerpoint.length === 0) {
                setWinnerpoint([winner]);
            } else if (winnerpoint.length === 1 && winnerpoint[0] !== winner) {
                const data = [...winnerpoint, winner];
                setWinnerpoint(data);
            } else if (winnerpoint.length === 1 && winnerpoint[0] === winner) {
                setWinnerpoint([]);
            } else if (winnerpoint.length === 2) {
                if (winnerpoint[0] === winner) {
                    const data = [winnerpoint[1]];
                    setWinnerpoint(data);
                } else if (winnerpoint[1] === winner) {
                    const data = [winnerpoint[0]];
                    setWinnerpoint(data);
                }
            }
        };
    }

    return (
        <>
            <div className="flex flex-col w-full h-full p-1 space-y-0 z-0">
                {/* 상단 팀 (플레이어 1, 2) */}
                <div className="flex h-1/2 space-x-0">
                    <div className="flex flex-row justify-center items-center w-1/2 bg-blue-300 p-0 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player1Avatar}
                                alt="Player 1"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-0">
                            <div className="text-sm  font-medium text-gray-800">{p1?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p1?.age}
                                {p1?.grade}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-1/2 bg-green-200 p-0 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player2Avatar}
                                alt="Player 2"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-0">
                            <div className="text-sm font-medium text-gray-800">{p2?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p2?.age}
                                {p2?.grade}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 하단 팀 (플레이어 3, 4) */}
                <div className="flex h-1/2 space-x-0">
                    <div className="flex flex-row justify-center items-center w-1/2 bg-red-200 p-0 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player3Avatar}
                                alt="Player 3"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-0">
                            <div className="text-sm font-medium text-gray-800">{p3?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p3?.age}
                                {p3?.grade}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-1/2 bg-purple-200 p-0 rounded-lg shadow-md">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={player4Avatar}
                                alt="Player 4"
                                width={50}
                                height={50}
                                className="object-cover w-12 h-12"
                            />
                        </div>
                        <div className="ml-0">
                            <div className="text-sm font-medium text-gray-800">{p4?.name}</div>
                            <div className="text-xs text-gray-600">
                                {p4?.age}
                                {p4?.grade}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 게임 종료 버튼 */}
                <div className="flex flex-row justify-center items-center space-x-4">
                    <div
                        className="text-center bg-red-500 text-white w-1/2 rounded-full cursor-pointer py-0"
                        onClick={() => setIsShowResult(!isShowResult)}
                    >
                        게임종료
                    </div>
                </div>
            </div>

            {/* 승자 선택 모달 */}
            <div
                className={`fixed left-0 top-72 w-full h-full bg-black bg-opacity-50  ${
                    isShowResult ? "block" : "hidden"
                } z-50`}
            >
                <div
                    className="relative  left-1/2 transform -translate-x-1/2 bg-white rounded-t-lg shadow-lg
                 space-y-4 w-1/4 max-w-md"
                >
                    <div className="text-center text-lg font-semibold">승리자를 입력하세요</div>
                    <div className="flex flex-col p-0 space-y-0">
                        <div className="flex flex-row p-0 justify-evenly items-center space-x-0">
                            <div
                                onClick={selectWinner(1)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(1) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player1Avatar}
                                    alt="Player 1"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{p1?.name}</div>
                            </div>
                            <div
                                onClick={selectWinner(2)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(2) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player2Avatar}
                                    alt="Player 2"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{p2?.name}</div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center space-x-0">
                            <div
                                onClick={selectWinner(3)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(3) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player3Avatar}
                                    alt="Player 3"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{p3?.name}</div>
                            </div>
                            <div
                                onClick={selectWinner(4)}
                                className={`flex flex-col justify-center items-center w-1/2 p-0 rounded-lg ${
                                    winnerpoint.includes(4) ? "bg-yellow-300" : ""
                                }`}
                            >
                                <Image
                                    src={player4Avatar}
                                    alt="Player 4"
                                    width={50}
                                    height={50}
                                    className="object-cover w-12 h-12 rounded-full"
                                />
                                <div className="text-sm font-medium text-gray-800">{p4?.name}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center text-center gap-1">
                        {/* 결과 입력 버튼 */}
                        <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            onClick={() => {
                                if (winnerpoint.length === 0) {
                                    endMatchFunction(gameid, []);
                                    onEndMatch();
                                    setIsShowResult(false);
                                    setWinnerpoint([]);
                                }
                                if (winnerpoint.length === 1) {
                                    alert("승리자를 두명 선택해주세요.");
                                }
                                if (winnerpoint.length === 2) {
                                    endMatchFunction(gameid, winnerpoint);
                                    onEndMatch();
                                    setIsShowResult(false);
                                    setWinnerpoint([]);
                                }
                            }}
                        >
                            결과입력
                        </button>
                        {/* 취소 버튼 */}
                        <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            onClick={() => {
                                setIsShowResult(false);
                                setWinnerpoint([]);
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
