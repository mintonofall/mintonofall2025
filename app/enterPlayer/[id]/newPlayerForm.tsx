import Link from "next/link";
import { getUploadURL, handlePlayerCreate } from "./action";
import { useActionState, useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
// import Image from "next/image";

interface Props {
    clubid: number;
    name: string;
}

export default function NewPlayerForm({ clubid, name }: Props) {
    const [state, action] = useActionState(InterceptAction, null);
    const [preview, setPreview] = useState("");
    const [uploadURL, setUploadURL] = useState("");
    const [imageID, setImageID] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = clubid;
            setId(resolvedParams);
            console.log(id);
            console.log(resolvedParams);
        }
        fetchParams();
    }, [clubid]);
    async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        const file = event.target.files[0];
        console.log(event);
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

    // async function choiceImage(image: string) {
    //     const file = [new File([image], image)];
    //     console.log(file);

    //     const previewURL = URL.createObjectURL(file[0]);
    //     console.log(previewURL);
    //     setPreview(previewURL);
    //     const result = await getUploadURL();
    //     setUploadURL(result.result.uploadURL);
    //     setImageID(result.result.id);
    //     if (state) {
    //         console.log(state);
    //     }
    // }

    async function InterceptAction(_: unknown, formData: FormData) {
        const file = formData.get("photo");
        if (preview.startsWith("https")) {
            const editPreview = preview.slice(0, -7);
            formData.set("photo", editPreview);
            return handlePlayerCreate(_, formData);
        }
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
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form action={action} className="flex flex-col space-y-6">
                <div>
                    <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-700">
                        플레이어 이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="플레이어 이름"
                        name="name"
                        defaultValue={name}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="photo" className="block mb-2 text-lg font-medium text-gray-700">
                        사진
                    </label>
                    <label
                        htmlFor="photo"
                        className="flex justify-center items-center h-52 w-52 mx-auto border-dashed border-2 border-gray-300 rounded-lg bg-cover bg-inherit bg-center bg-no-repeat cursor-pointer"
                        style={{
                            backgroundImage: `url(${preview})`,
                        }}
                    >
                        {preview ? (
                            ""
                        ) : (
                            <div className="flex flex-col items-center">
                                <PhotoIcon className="w-12 h-12 text-gray-400" />
                                <p className="m-2 text-center text-gray-500">
                                    원할한 게임진행을 위해 여기를 눌러 얼굴이 잘 보이게 등록해 주세요, 혹은 오늘의
                                    착샷을 찍어주세요
                                </p>
                            </div>
                        )}
                    </label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    {/* <div className="grid grid-cols-4 gap-4 mt-4">
                        <Image
                            src="/man1.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="man1"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/663f3d39-64a8-4b7c-173d-3f3056617b00/avatar"
                                )
                            }
                        />
                        <Image
                            src="/man2.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="man2"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/31b7ad05-9977-48e7-2cb5-e4fa03396d00/avatar"
                                )
                            }
                        />
                        <Image
                            src="/man3.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="man3"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/30b763c7-5649-4b57-f478-b25753f77200/avatar"
                                )
                            }
                        />
                        <Image
                            src="/man4.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="man4"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/abac9787-3620-4deb-98e3-45304c331900/avatar"
                                )
                            }
                        />
                        <Image
                            src="/woman1.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="woman1"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/c39ea68b-b697-4c88-6dea-554f05d7a900/avatar"
                                )
                            }
                        />
                        <Image
                            src="/woman2.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="woman2"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/976cf4e6-4608-4745-26c3-543097837600/avatar"
                                )
                            }
                        />
                        <Image
                            src="/wm1.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="woman3"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/65919dbd-6063-4e2d-5793-36b81c142100/avatar"
                                )
                            }
                        />
                        <Image
                            src="/wm3.png"
                            className="rounded-lg cursor-pointer hover:opacity-75"
                            alt="woman4"
                            width={100}
                            height={100}
                            style={{ height: 100 }}
                            onClick={() =>
                                setPreview(
                                    "https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/ac74a3c3-bd0b-4d36-83c7-5b79b6c38d00/avatar"
                                )
                            }
                        />
                    </div> */}
                </div>
                <div className="flex flex-col space-y-2">
                    <span className="text-lg font-medium text-gray-700">성별</span>
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
                    <span className="text-lg font-medium text-gray-700">나이</span>
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
                    <span className="text-lg font-medium text-gray-700">등급</span>
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
                <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                    생성
                </button>
                <Link href={`/${id}/board`}>
                    <div className="bg-blue-500 text-center text-white p-3 rounded-lg hover:bg-blue-600">돌아가기</div>
                </Link>
            </form>
        </div>
    );
}
