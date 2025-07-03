import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface ScoreInputProps {
    score1: number;
    setScore1: React.Dispatch<React.SetStateAction<number>>;
    score2: number;
    setScore2: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * 경기 점수를 입력하고 조작하는 컴포넌트입니다.
 * 팀 1과 팀 2의 점수를 표시하고, 각각 1점 또는 5점씩 증감시킬 수 있는 버튼을 제공합니다.
 */
export default function ScoreInput({ score1, setScore1, score2, setScore2 }: ScoreInputProps) {
    return (
        <>
            <div className="text-2xl font-bold text-center mb-2">{score1}</div>
            <div className="flex justify-center gap-0 mb-4">
                <span className="m-0 p-0">5</span>
                <MinusCircleIcon
                    onClick={() => {
                        setScore1(score1 - 5);
                    }}
                    className="h-6 w-6 text-red-500 cursor-pointer"
                />
                <MinusCircleIcon
                    onClick={() => {
                        setScore1(score1 - 1);
                    }}
                    className="h-6 w-6 mx-5 text-red-500 cursor-pointer"
                />
                <PlusCircleIcon
                    onClick={() => {
                        setScore1(score1 + 1);
                    }}
                    className="h-6 w-6 text-green-500 cursor-pointer"
                />
            </div>
            <div className="border-b border-gray-300 my-4"></div>
            <div className="flex justify-center gap-0 mb-4">
                <span className="m-0 p-0">5</span>
                <MinusCircleIcon
                    onClick={() => {
                        setScore2(score2 - 5);
                    }}
                    className="h-6 w-6 text-red-500 cursor-pointer"
                />
                <MinusCircleIcon
                    onClick={() => {
                        setScore2(score2 - 1);
                    }}
                    className="h-6 w-6 mx-5 text-red-500 cursor-pointer"
                />
                <PlusCircleIcon
                    onClick={() => {
                        setScore2(score2 + 1);
                    }}
                    className="h-6 w-6 text-green-500 cursor-pointer"
                />
            </div>
            <div className="text-2xl font-bold text-center mb-4">{score2}</div>
        </>
    );
}
