"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getProfileImageUploadURL, updateProfileImage } from "./action";

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.crossOrigin = "anonymous";
        image.src = url;
    });
}

async function getCroppedImageBlob(imageSrc: string, area: Area): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = area.width;
    canvas.height = area.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("캔버스를 생성할 수 없습니다.");

    ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("이미지를 변환할 수 없습니다."));
        }, "image/jpeg", 0.92);
    });
}

export default function ProfilePhotoUploader({ initialImage }: { initialImage: string | null }) {
    const [currentImage, setCurrentImage] = useState(initialImage);
    const [selectedFileSrc, setSelectedFileSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError("");
        setSelectedFileSrc(URL.createObjectURL(file));
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        e.target.value = "";
    };

    const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleCancel = () => {
        setSelectedFileSrc(null);
        setError("");
    };

    const handleSave = async () => {
        if (!selectedFileSrc || !croppedAreaPixels) return;
        setIsSaving(true);
        setError("");
        try {
            const blob = await getCroppedImageBlob(selectedFileSrc, croppedAreaPixels);
            const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

            const uploadURLResult = await getProfileImageUploadURL();
            if ("error" in uploadURLResult) {
                setError(uploadURLResult.error);
                return;
            }

            const uploadForm = new FormData();
            uploadForm.append("file", file);
            const response = await fetch(uploadURLResult.result.uploadURL, {
                method: "POST",
                body: uploadForm,
            });
            if (response.status !== 200) {
                setError("사진 업로드에 실패했습니다.");
                return;
            }

            const imageURL = `https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/${uploadURLResult.result.id}`;
            const saveResult = await updateProfileImage(imageURL);
            if ("error" in saveResult) {
                setError(saveResult.error);
                return;
            }

            setCurrentImage(imageURL);
            setSelectedFileSrc(null);
        } catch (err) {
            console.error("프로필 사진을 저장하는 중 오류가 발생했습니다:", err);
            setError("사진을 저장하는 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    if (selectedFileSrc) {
        return (
            <div className="mb-6">
                <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
                    <Cropper
                        image={selectedFileSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500 shrink-0">확대</span>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1"
                    />
                </div>
                {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
                <div className="flex justify-center gap-2 mt-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 disabled:bg-gray-300"
                    >
                        {isSaving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mb-6">
            <label htmlFor="profilePhotoInput" className="cursor-pointer group relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    {currentImage ? (
                        <img src={currentImage} alt="프로필 사진" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-300 text-4xl">👤</span>
                    )}
                </div>
                <span className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                    변경
                </span>
            </label>
            <input id="profilePhotoInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <p className="text-xs text-gray-400 mt-1">사진을 눌러 변경하세요</p>
            {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
        </div>
    );
}
