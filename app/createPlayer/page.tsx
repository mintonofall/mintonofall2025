"use client";
import "@picocss/pico";
import { handlePlayerCreate, getUploadURL } from "./action";
import { useActionState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

export default function CreatePlayer({ params }: { params: { id: string } }) {
    const [state, action] = useActionState(InterceptAction, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");
    async function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        if (!event.target.files) return;
        const file = event.target.files[0];
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
        const result = await getUploadURL();
        setUploadURL(result.result.uploadURL);
        setImageID(result.result.id);
    }

    async function InterceptAction(_: any, formData: FormData) {
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
        <div className="p-7">
            <h1 className="text-3xl">선수를 등록해 주세요</h1>
            <form className="flex flex-col gap-4" action={action}>
                <input type="text" name="name" placeholder="선수이름" />
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
                    className="hidden"
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <div className="flex-row">
                    <input type="radio" name="age" value={20} id="20" />
                    <label htmlFor="20"> 20대</label>
                    <input type="radio" name="age" value={30} id="30" />
                    <label htmlFor="30"> 30대</label>
                    <input
                        type="radio"
                        name="age"
                        value={40}
                        id="40"
                        defaultChecked
                    />
                    <label htmlFor="40"> 40대</label>
                    <input type="radio" name="age" value={50} id="50" />
                    <label htmlFor="50"> 50대</label>
                    <input type="radio" name="age" value={60} id="60" />
                    <label htmlFor="60"> 60대</label>
                </div>
                <div className="flex flex-row items-center">
                    <input
                        type="radio"
                        name="gender"
                        value={"man"}
                        id="man"
                        defaultChecked
                    />
                    <label htmlFor="man">남성</label>
                    <input
                        type="radio"
                        name="gender"
                        value={"woman"}
                        id="woman"
                    />
                    <label htmlFor="woman">여성</label>
                </div>
                <div className="flex-row">
                    <input type="radio" name="grade" value="S" id="S" />
                    <label htmlFor="S"> S</label>
                    <input
                        type="radio"
                        name="grade"
                        value="A"
                        id="A"
                        defaultChecked
                    />
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
                <input type="number" value={params.id} name="clubId" hidden />
                <button type="submit">선수등록</button>
            </form>
        </div>
    );
}
