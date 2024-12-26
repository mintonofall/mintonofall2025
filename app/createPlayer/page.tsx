"use client";
import { handlePlayerCreate, getUploadURL } from "./action";
import { useActionState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

export default function CreatePlayer({ params }: { params: { id: string } }) {
    const [, action] = useActionState(InterceptAction, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");
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
        return handlePlayerCreate(_, formData);
    }

    return (
        <div className="p-7 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">선수를 등록해 주세요</h1>
            <form className="flex flex-col gap-4" action={action}>
                <input
                    type="text"
                    name="name"
                    placeholder="선수이름"
                    className="p-2 border border-gray-300 rounded-md"
                />
                <label
                    htmlFor="photo"
                    className="flex justify-center items-center w-full h-64 border-dashed border-2 border-gray-300 rounded-lg bg-cover bg-center bg-no-repeat cursor-pointer"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    {preview ? "" : <PhotoIcon className="w-12 h-12 text-gray-400" />}
                </label>
                <input
                    className="hidden"
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <div className="flex flex-col gap-2">
                    <span className="font-semibold">나이</span>
                    <div className="flex flex-wrap gap-2">
                        <label className="flex items-center gap-1">
                            <input type="radio" name="age" value={20} id="20" />
                            20대
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="age" value={30} id="30" />
                            30대
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="age" value={40} id="40" defaultChecked />
                            40대
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="age" value={50} id="50" />
                            50대
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="age" value={60} id="60" />
                            60대
                        </label>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-semibold">성별</span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                            <input type="radio" name="gender" value={"man"} id="man" defaultChecked />
                            남성
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="gender" value={"woman"} id="woman" />
                            여성
                        </label>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-semibold">등급</span>
                    <div className="flex flex-wrap gap-2">
                        <label className="flex items-center gap-1">
                            <input type="radio" name="grade" value="S" id="S" />S
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="grade" value="A" id="A" defaultChecked />A
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="grade" value="B" id="B" />B
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="grade" value="C" id="C" />C
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="grade" value="D" id="D" />D
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="grade" value="E" id="E" />E
                        </label>
                    </div>
                </div>
                <input type="number" value={params.id} name="clubId" hidden />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    선수등록
                </button>
            </form>
        </div>
    );
}
