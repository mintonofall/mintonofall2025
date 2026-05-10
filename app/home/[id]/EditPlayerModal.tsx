/**
 * @file /app/home/[id]/EditPlayerModal.tsx
 * @description 선수 정보를 수정하는 모달 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useState, useEffect } from "react";
import { getUploadURL } from "@/app/editPlayer/[id]/action";

/**
 * EditPlayerModal 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달 닫기 함수
 * @param {any} props.player - 수정할 선수 정보
 * @param {(updatedPlayer: any) => void} props.onConfirm - 선수 정보 수정 확인 함수
 */
export default function EditPlayerModal({
    isOpen,
    onClose,
    player,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    player: any;
    onConfirm: (updatedPlayer: any) => void;
}) {
    /** @type {any | null} 수정 중인 선수 정보를 담는 상태 */
    const [editedPlayer, setEditPlayer] = useState<any>(null);

    /** @type {boolean} 이미지 업로드 진행 상태 */
    const [isUploading, setIsUploading] = useState(false);
    /** @type {File | null} 선택된 이미지 파일 */
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    /** @type {string} 로컬 미리보기 URL */
    const [previewUrl, setPreviewUrl] = useState<string>("");

    /**
     * `player` prop이 변경될 때마다 `editedPlayer` 상태를 업데이트합니다.
     * 모달이 열릴 때 전달받은 선수 정보로 폼을 초기화하는 역할을 합니다.
     */
    useEffect(() => {
        if (isOpen) {
            setEditPlayer(player);
            setSelectedFile(null);
            setPreviewUrl("");
            setIsUploading(false);
        }
    }, [player, isOpen]);

    /**
     * 파일 선택 핸들러
     * 이미지를 선택하면 파일 객체를 상태에 저장하고 미리보기를 제공합니다.
     */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    /**
     * 폼 제출 핸들러 (저장 버튼 클릭 시)
     * 새로운 이미지가 선택되었다면 업로드 후 URL을 받아와 선수 정보에 포함합니다.
     */
    const handleSubmit = async () => {
        if (!editedPlayer) return;
        let finalPlayer = { ...editedPlayer };

        if (selectedFile) {
            try {
                setIsUploading(true);
                const result = await getUploadURL();
                const uploadURL = result.result.uploadURL;
                const imageID = result.result.id;

                const cloudflare = new FormData();
                cloudflare.append("file", selectedFile);

                const response = await fetch(uploadURL, { method: "POST", body: cloudflare });
                if (response.status !== 200) {
                    alert("이미지 업로드에 실패했습니다.");
                    setIsUploading(false);
                    return;
                }
                finalPlayer.avater = `https://imagedelivery.net/H_vtnjYSM5axKm4PivHM5g/${imageID}`;
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("이미지 업로드 중 오류가 발생했습니다.");
                setIsUploading(false);
                return;
            }
        }

        onConfirm(finalPlayer);
        setIsUploading(false);
    };

    // 모달이 닫혀있거나 수정할 선수 정보가 없으면 아무것도 렌더링하지 않음
    if (!isOpen || !editedPlayer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4">선수 정보 수정</h2>
                <div className="flex flex-col gap-4">
                    {/* 이름 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.name || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, name: e.target.value })}
                        />
                    </div>
                    {/* 나이 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">나이</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.age || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, age: e.target.value })}
                        />
                    </div>
                    {/* 급수 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">급수</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={editedPlayer.grade || ""}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, grade: e.target.value })}
                        />
                    </div>
                    {/* 사진 파일 업로드 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            사진 수정
                            {isUploading && (
                                <span className="ml-2 text-blue-500 text-xs font-normal">업로드 중...</span>
                            )}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleFileSelect}
                            disabled={isUploading}
                        />
                        {(previewUrl || editedPlayer.avater) && (
                            <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                <img
                                    src={
                                        previewUrl ||
                                        (editedPlayer.avater?.startsWith("https://imagedelivery.net/")
                                            ? `${editedPlayer.avater}/avatar`
                                            : editedPlayer.avater)
                                    }
                                    alt="미리보기"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                    {/* 리그 참가 여부 체크박스 */}
                    <div className="flex items-center">
                        <input
                            id="isJoinLeague"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={editedPlayer.isJoinLeague || false}
                            onChange={(e) => setEditPlayer({ ...editedPlayer, isJoinLeague: e.target.checked })}
                        />
                        <label htmlFor="isJoinLeague" className="ml-2 block text-sm text-gray-900">
                            리그 참가
                        </label>
                    </div>
                </div>
                {/* 하단 버튼 (취소, 저장) */}
                <div className="mt-6 flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className={`px-4 py-2 text-white rounded ${isUploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        onClick={handleSubmit}
                        disabled={isUploading}
                    >
                        {isUploading ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>
        </div>
    );
}
