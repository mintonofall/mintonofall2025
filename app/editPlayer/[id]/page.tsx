"use client";
import { handlePlayerEdit, getUploadURL } from "./action";
import { useActionState } from "react";
import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getPlayer } from "@/lib/getUserGoHome";
import { Player } from "@/lib/interface";

export default function EditPlayer({ params }: { params: Promise<{ id: string }> }) {
    const [state, action] = useActionState(InterceptAction, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");
    const [id, setId] = useState<number | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [playerName, setPlayerName] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [grade, setGrade] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).id;
            const idToNumber = Number(resolvedParams);
            setId(idToNumber);
            console.log(id);
            console.log(resolvedParams);
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchPlayer() {
            console.log("player fetch start");
            if (!id) return;
            const playerData = await getPlayer(id);
            if (!playerData) return;
            if (!playerData.avater) return;
            setPlayer(playerData);
            setPlayerName(playerData.name);
            setAge(playerData.age);
            setGrade(playerData.grade);
            setGender(playerData.gender);
            console.log(playerData);
            setPreview(`${playerData.avater}/avatar`);
        }
        fetchPlayer();
    }, [id]);

    async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        const file = event.target.files[0];
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        const result = await getUploadURL();
        setUploadURL(result.result.uploadURL);
        console.log(uploadURL);
        setImageID(result.result.id);
        console.log(imageID);
        if (state) {
            console.log(state);
        }
    }
    async function InterceptAction(_: unknown, formData: FormData) {
        const file = formData.get("photo");
        if (!file) return;
        const cloudflare = new FormData();
        cloudflare.append("file", file);
        const response = await fetch(uploadURL, {
            method: "POST",
            body: cloudflare,
        });
        if (response.status !== 200) {
            console.error("Upload failed");
            return;
        }
        const imageURL = `https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/${imageID}`;
        console.log(imageURL);
        formData.set("photo", imageURL);
        setPreview("");
        return handlePlayerEdit(_, formData);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">플레이어 수정</h2>
                <form action={action} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="playerName" className="block mb-2 text-gray-700">
                            플레이어 이름
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="플레이어 이름"
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
                                    id="man"
                                    // defaultChecked
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
                                    id="woman"
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
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="age"
                                    value={20}
                                    id="20"
                                    onChange={() => setAge(20)}
                                    checked={age === 20}
                                />
                                <span>20대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="age"
                                    value={30}
                                    id="30"
                                    onChange={() => setAge(30)}
                                    checked={age === 30}
                                />
                                <span>30대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="age"
                                    value={40}
                                    id="40"
                                    // defaultChecked
                                    checked={age === 40}
                                    onChange={() => setAge(40)}
                                />
                                <span>40대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="age"
                                    value={50}
                                    id="50"
                                    onChange={() => setAge(50)}
                                    checked={age === 50}
                                />
                                <span>50대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="age"
                                    value={60}
                                    id="60"
                                    onChange={() => setAge(60)}
                                    checked={age === 60}
                                />
                                <span>60대</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-gray-700">등급</span>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="grade"
                                    value="S"
                                    id="S"
                                    onChange={(e) => setGrade(e.target.value)}
                                    checked={grade == "S"}
                                />
                                <span>S</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="grade"
                                    value="A"
                                    id="A"
                                    onChange={(e) => setGrade(e.target.value)}
                                    // defaultChecked
                                    checked={grade == "A"}
                                />
                                <span>A</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="grade"
                                    value="B"
                                    id="B"
                                    onChange={(e) => setGrade(e.target.value)}
                                    checked={grade == "B"}
                                />
                                <span>B</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="grade"
                                    value="C"
                                    id="C"
                                    onChange={(e) => setGrade(e.target.value)}
                                    checked={grade == "C"}
                                />
                                <span>C</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="grade"
                                    value="D"
                                    id="D"
                                    onChange={(e) => setGrade(e.target.value)}
                                    checked={grade == "D"}
                                />
                                <span>D</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="grade"
                                    value="E"
                                    id="E"
                                    onChange={(e) => setGrade(e.target.value)}
                                    checked={grade == "E"}
                                />
                                <span>E</span>
                            </label>
                        </div>
                    </div>
                    <input type="number" value={player?.clubid} name="clubId" hidden readOnly />
                    {player && <input type="number" value={player.id} name="playerId" hidden readOnly />}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        수정
                    </button>
                </form>
            </div>
        </div>
    );
}
