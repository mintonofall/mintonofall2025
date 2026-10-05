"use client";
import { createPlayerEditRequest, getUploadURL } from "./action";
import { useActionState } from "react";
import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getPlayer } from "@/lib/getUserGoHome";
import { Player } from "@/lib/interface";
import Link from "next/link";

export default function PlayerEditRequestPage({ params }: { params: Promise<{ id: string; playerId: string }> }) {
    const [state, action, isPending] = useActionState(InterceptAction, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");
    const [clubId, setClubId] = useState<number | null>(null);
    const [playerId, setPlayerId] = useState<number | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [playerName, setPlayerName] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [grade, setGrade] = useState("");
    const [gender, setGender] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            setClubId(Number(resolvedParams.id));
            setPlayerId(Number(resolvedParams.playerId));
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchPlayer() {
            if (!playerId) return;
            const playerData = await getPlayer(playerId);
            if (!playerData) return;

            setPlayer(playerData);
            setPlayerName(playerData.name || "");
            setAge(playerData.age || null);
            setGrade(playerData.grade || "");
            setGender(playerData.gender || "");
            if (playerData.avater) {
                setPreview(`${playerData.avater}/avatar`);
            }
        }
        fetchPlayer();
    }, [playerId]);

    async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        const file = event.target.files[0];
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        const result = await getUploadURL();
        setUploadURL(result.result.uploadURL);
        setImageID(result.result.id);
    }

    async function InterceptAction(_: unknown, formData: FormData) {
        const file = formData.get("photo") as File | null;
        if (!file || file.size === 0) {
            formData.delete("photo");
            return createPlayerEditRequest(_, formData);
        }

        const cloudflare = new FormData();
        cloudflare.append("file", file);
        const response = await fetch(uploadURL, {
            method: "POST",
            body: cloudflare,
        });
        if (response.status !== 200) {
            console.error("Upload failed");
            return { error: "사진 업로드에 실패했습니다." };
        }

        if (imageID) {
            const imageURL = `https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/${imageID}`;
            formData.set("photo", imageURL);
        }

        return createPlayerEditRequest(_, formData);
    }

    if (state && "success" in state && state.success) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-teal-600">수정요청이 접수되었습니다</h2>
                    <p className="text-gray-600 mb-6">
                        운영자가 요청 내용을 확인하고 승인하면 선수 정보가 변경됩니다.
                    </p>
                    {clubId !== null && (
                        <Link
                            href={`/home/${clubId}/viewPage`}
                            className="inline-block bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700"
                        >
                            돌아가기
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center">선수 정보 수정요청</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    요청하신 내용은 운영자 승인 후 실제로 반영됩니다.
                </p>
                {state && "error" in state && state.error && (
                    <p className="text-red-500 text-sm text-center mb-4">{state.error}</p>
                )}
                <form action={action} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-gray-700">
                            선수 이름
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="선수 이름"
                            name="name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="photo" className="block mb-2 text-gray-700">
                            사진
                        </label>
                        <label
                            htmlFor="photo"
                            className="flex justify-center items-center w-full h-72 border-dashed border-2 border-gray-300 rounded-lg bg-cover bg-center bg-no-repeat cursor-pointer"
                            style={{
                                backgroundImage: `url(${preview})`,
                            }}
                        >
                            {preview ? "" : <PhotoIcon className="w-12 h-12 text-gray-400" />}
                        </label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-gray-700">성별</span>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="man"
                                    checked={gender === "man"}
                                    onChange={() => setGender("man")}
                                />
                                <span>남성</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="woman"
                                    checked={gender === "woman"}
                                    onChange={() => setGender("woman")}
                                />
                                <span>여성</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-gray-700">나이</span>
                        <div className="flex space-x-4">
                            {[20, 30, 40, 50, 60].map((decade) => (
                                <label key={decade} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="age"
                                        value={decade}
                                        checked={age === decade}
                                        onChange={() => setAge(decade)}
                                    />
                                    <span>{decade}대</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-gray-700">등급</span>
                        <div className="flex space-x-4">
                            {["S", "A", "B", "C", "D", "E"].map((g) => (
                                <label key={g} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="grade"
                                        value={g}
                                        checked={grade === g}
                                        onChange={(e) => setGrade(e.target.value)}
                                    />
                                    <span>{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block mb-2 text-gray-700">
                            요청 내용 (선택)
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="추가로 전달할 내용이 있다면 입력해주세요."
                            className="w-full p-2 border border-gray-300 rounded h-24 resize-none"
                        />
                    </div>
                    {clubId !== null && <input type="number" value={clubId} name="clubId" hidden readOnly />}
                    {playerId !== null && <input type="number" value={playerId} name="playerId" hidden readOnly />}
                    <div className="flex gap-2 mt-4">
                        {clubId !== null && (
                            <Link
                                href={`/home/${clubId}/viewPage`}
                                className="flex-1 bg-gray-200 text-gray-800 p-2 rounded text-center hover:bg-gray-300"
                            >
                                취소
                            </Link>
                        )}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-teal-600 text-white p-2 rounded hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isPending ? "제출 중..." : "수정요청 제출"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
