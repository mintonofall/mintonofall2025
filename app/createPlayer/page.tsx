"use client";
import { handlePlayerCreate, getUploadURL } from "./action";
import { useActionState } from "react";
import React, { useState, useEffect } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CreatePlayer({ params }: PageProps) {
    const [, action] = useActionState(handlePlayerCreate, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            console.log(resolvedParams.id);
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
                        name="playerName"
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    <label htmlFor="photo" className="mb-2 text-gray-700">
                        사진
                    </label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    {preview && <img src={preview} alt="Preview" className="mb-4 w-full h-auto" />}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        생성
                    </button>
                </form>
            </div>
        </div>
    );
}
