"use client";
import { handlePlayerCreate, getUploadURL } from "./action";
import { useActionState } from "react";
import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function CreatePlayer({ params }: { params: Promise<{ clubid: string }> }) {
    const [state, action] = useActionState(InterceptAction, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = (await params).clubid;
            setId(resolvedParams);
            console.log(id);
            console.log(resolvedParams);
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
        return handlePlayerCreate(_, formData);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white relative p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="absolute top-5 right-5 w-20 h-4 ">
                    <Link href={"/createPlayer/" + id + "/createPlayerMany"}>
                        <button className="absolute rounded p-2 top-0 left-0 bg-blue-500 text-white z-0">
                            여러선수등록
                        </button>
                    </Link>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">플레이어 생성</h2>
                <form action={action} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-gray-700">
                            플레이어 이름
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="플레이어 이름"
                            name="name"
                            defaultValue=""
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
                    <input type="number" value={Number(id)} name="clubId" hidden readOnly />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        생성
                    </button>
                    <Link href={`/home/${id}`}>
                        <div className="bg-blue-500 text-center text-white p-2 rounded hover:bg-blue-600">돌아가기</div>
                    </Link>
                </form>
            </div>
        </div>
    );
}
