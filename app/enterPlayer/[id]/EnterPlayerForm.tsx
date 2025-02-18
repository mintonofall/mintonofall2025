"use client";
import { Player } from "@/lib/interface";
// 1. 이름을 확인한다
// 2. 이름을 확인해 있는 이름이면 나타내주고 수정할꺼냐고 물어보고
// 3. 없는 이름이면 사진과, 나이대와, 성별, 급수를 입력받는다
// 4. 입력을 다하면 안내페이지로 안내한다
import { useState } from "react";
import { checkName } from "./utility";
import PlayerCard from "@/app/component/PlayerCard";
import Link from "next/link";
import NewPlayerForm from "./newPlayerForm";

export default function EnterPlayerForm({ id }: { id: number }) {
    const [showNameForm, setShowNameForm] = useState(true);
    const [showCheck, setShowCheck] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [showNotice, setShowNotice] = useState(false);
    const [name, setName] = useState("");
    const [players, setPlayers] = useState<Player[]>([]);

    return (
        <div className="p-4">
            <div>
                {showNameForm ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">이름을 입력하세요</h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            onClick={async () => {
                                const result = await checkName(name, id);
                                setPlayers(result);
                                if (result.length === 0) {
                                    setShowInput(true);
                                    setShowNameForm(false);
                                } else {
                                    setShowNameForm(false);
                                    setShowCheck(true);
                                }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            확인
                        </button>
                    </div>
                ) : null}
            </div>
            {showCheck ? (
                <div className="space-y-4">
                    {players.map((player) => {
                        return (
                            <div key={player.id} className="p-4 border border-gray-300 rounded">
                                <PlayerCard {...player} />
                                <div className="space-x-2 mt-2">
                                    <button
                                        onClick={() => {
                                            setShowCheck(false);
                                            setShowNotice(true);
                                        }}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        이걸로 입장
                                    </button>
                                    <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                        새로등록
                                    </button>
                                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        수정
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
            {showInput ? (
                <div className="space-y-4">
                    <h1 className="text-xl font-semibold">Input Form</h1>
                    <NewPlayerForm clubid={id} name={name} />
                </div>
            ) : null}
            {showNotice ? (
                <div className="space-y-4">
                    <h1 className="text-xl font-semibold">Notice Form</h1>
                    <p>
                        환영합니다. 모두의민턴 입니다. 아래의 버튼을 누르시면 체육관 현황을 확인하실수 있습니다.
                        즐거운운동되시길 바랍니다.
                    </p>
                    <Link href={`/${id}/board`} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        입장하기
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
