"use client";
import { handlePlayerCreate, getUploadURL } from "./action";
import { useActionState } from "react";
import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CreatePlayer({ params }: PageProps) {
    const [state, action] = useActionState(handlePlayerCreate, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            console.log(resolvedParams.id);
            setId(resolvedParams.id);
        }
        fetchParams();
    }, [params]);

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
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">플레이어 생성</h2>
                <form action={action} className="flex flex-col">
                    <label htmlFor="playerName" className="mb-2 text-gray-700">
                        플레이어 이름
                    </label>
                    <input
                        type="text"
                        id="playerName"
                        placeholder="플레이어 이름"
                        name="name"
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    <label htmlFor="photo" className="mb-2 text-gray-700">
                        사진
                    </label>
                    <label
                        htmlFor="photo"
                        className="flex justify-center items-center size-full aspect-square border-dashed border-2 border-gray-300 rounded-lg bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${preview})`,
                        }}
                    >
                        {preview ? "" : <PhotoIcon className="size-48" />}
                    </label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden mb-4 p-2 border border-gray-300 rounded"
                    />
                    {preview && <img src={preview} alt="Preview" className="hidden mb-4 w-full h-auto" />}
                    <div className="flex-row">
                        <input type="radio" name="age" value={20} id="20" />
                        <label htmlFor="20"> 20대</label>
                        <input type="radio" name="age" value={30} id="30" />
                        <label htmlFor="30"> 30대</label>
                        <input type="radio" name="age" value={40} id="40" defaultChecked />
                        <label htmlFor="40"> 40대</label>
                        <input type="radio" name="age" value={50} id="50" />
                        <label htmlFor="50"> 50대</label>
                        <input type="radio" name="age" value={60} id="60" />
                        <label htmlFor="60"> 60대</label>
                    </div>
                    <div className="flex-row">
                        <input type="radio" name="grade" value="S" id="S" />
                        <label htmlFor="S"> S</label>
                        <input type="radio" name="grade" value="A" id="A" defaultChecked />
                        <label htmlFor="A"> A</label>
                        <input type="radio" name="grade" value="B" id="B" />
                        <label htmlFor="B">B</label>
                        <input type="radio" name="grade" value="C" id="C" />
                        <label htmlFor="C">C</label>
                        <input type="radio" name="grade" value="D" id="D" />
                        <label htmlFor="D">D</label>
                        <input type="radio" name="grade" value="E" id="E" />
                        <label htmlFor="E">E</label>
                    </div>
                    <input type="number" value={Number(id)} name="clubId" hidden />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        생성
                    </button>
                </form>
            </div>
        </div>
    );
}
