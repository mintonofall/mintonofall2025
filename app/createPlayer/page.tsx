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
        if (state) {
            console.log(state);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">플레이어 생성</h2>
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
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="photo" className="block mb-2 text-gray-700">
                            사진
                        </label>
                        <label
                            htmlFor="photo"
                            className="flex justify-center items-center w-full h-48 border-dashed border-2 border-gray-300 rounded-lg bg-cover bg-center bg-no-repeat cursor-pointer"
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
                                <input type="radio" name="gender" value="man" id="man" defaultChecked />
                                <span>남성</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="gender" value="woman" id="woman" />
                                <span>여성</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-gray-700">나이</span>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="age" value={20} id="20" />
                                <span>20대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="age" value={30} id="30" />
                                <span>30대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="age" value={40} id="40" defaultChecked />
                                <span>40대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="age" value={50} id="50" />
                                <span>50대</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="age" value={60} id="60" />
                                <span>60대</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <span className="text-gray-700">등급</span>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="grade" value="S" id="S" />
                                <span>S</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="grade" value="A" id="A" defaultChecked />
                                <span>A</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="grade" value="B" id="B" />
                                <span>B</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="grade" value="C" id="C" />
                                <span>C</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="grade" value="D" id="D" />
                                <span>D</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="grade" value="E" id="E" />
                                <span>E</span>
                            </label>
                        </div>
                    </div>
                    <input type="number" value={1} name="clubId" hidden />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        생성
                    </button>
                </form>
            </div>
        </div>
    );
}
