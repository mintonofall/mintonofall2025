/**
 * @file /app/home/[id]/AddPlayerModal.tsx
 * @description 신규 선수를 추가하는 모달 컴포넌트입니다.
 * @author Treebird
 * @date 2024-07-16
 */
import { useEffect, useState } from "react";
import { getUploadURL } from "@/app/editPlayer/[id]/action";

/**
 * AddPlayerModal 컴포넌트
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달 닫기 함수
 * @param {(player: any) => void} props.onConfirm - 선수 추가 확인 함수
 */
export default function AddPlayerModal({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (player: any) => void;
}) {
    /** @type {object} 새로 추가할 선수의 정보를 담는 상태 */
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        age: "",
        grade: "",
        gender: "man",
        isJoinLeague: false,
        avater: "",
    });

    /** @type {boolean} 이미지 업로드 진행 상태 */
    const [isUploading, setIsUploading] = useState(false);

    /** @type {File | null} 선택된 이미지 파일 */
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    /** @type {string} 로컬 미리보기 URL */
    const [previewUrl, setPreviewUrl] = useState<string>("");

    /**
     * 모달이 열릴 때마다 입력 폼을 초기화합니다.
     */
    useEffect(() => {
        if (isOpen) {
            setNewPlayer({
                name: "",
                age: "",
                grade: "",
                gender: "man",
                isJoinLeague: false,
                avater: "",
            });
            setSelectedFile(null);
            setPreviewUrl("");
            setIsUploading(false);
        }
    }, [isOpen]);

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
     * 폼 제출 핸들러 (추가 버튼 클릭 시)
     * 이미지가 선택되어 있다면 Cloudflare에 업로드 후 URL을 받아와 선수 정보에 포함합니다.
     */
    const handleSubmit = async () => {
        const validGrades = ["A", "B", "C", "D", "E", "S"];
        if (!validGrades.includes(newPlayer.grade)) {
            alert("급수는 A, B, C, D, E, S 중 하나여야 합니다.");
            return;
        }

        let finalPlayer = { ...newPlayer };

        if (selectedFile) {
            try {
                setIsUploading(true);

                // 1. Cloudflare 업로드용 URL 요청
                const result = await getUploadURL();
                const uploadURL = result.result.uploadURL;
                const imageID = result.result.id;

                // 2. FormData에 파일 담아서 Cloudflare에 POST 전송
                const cloudflare = new FormData();
                cloudflare.append("file", selectedFile);

                const response = await fetch(uploadURL, {
                    method: "POST",
                    body: cloudflare,
                });

                if (response.status !== 200) {
                    alert("이미지 업로드에 실패했습니다.");
                    setIsUploading(false);
                    return;
                }

                // 3. 업로드 성공 시 반환된 ID로 최종 이미지 URL 구성하여 상태 업데이트
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

    // 모달이 닫혀있으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4">선수 추가</h2>
                <div className="flex flex-col gap-4">
                    {/* 이름 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        />
                    </div>
                    {/* 나이 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">나이</label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.age}
                            onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                        />
                    </div>
                    {/* 성별 선택 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">성별</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.gender}
                            onChange={(e) => setNewPlayer({ ...newPlayer, gender: e.target.value })}
                        >
                            <option value="man">남성</option>
                            <option value="woman">여성</option>
                        </select>
                    </div>
                    {/* 급수 입력 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">급수</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={newPlayer.grade}
                            onChange={(e) => setNewPlayer({ ...newPlayer, grade: e.target.value })}
                        />
                    </div>
                    {/* 사진 파일 업로드 필드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            사진 업로드
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
                        {(previewUrl || newPlayer.avater) && (
                            <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                <img
                                    src={previewUrl || `${newPlayer.avater}/avatar`}
                                    alt="미리보기"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                    {/* 리그 참가 여부 체크박스 */}
                    <div className="flex items-center">
                        <input
                            id="isJoinLeagueAdd"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={newPlayer.isJoinLeague}
                            onChange={(e) => setNewPlayer({ ...newPlayer, isJoinLeague: e.target.checked })}
                        />
                        <label htmlFor="isJoinLeagueAdd" className="ml-2 block text-sm text-gray-900">
                            리그 참가
                        </label>
                    </div>
                </div>
                {/* 하단 버튼 (취소, 추가) */}
                <div className="mt-6 flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className={`px-4 py-2 text-white rounded ${isUploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        onClick={handleSubmit}
                        disabled={isUploading}
                    >
                        {isUploading ? "생성 중..." : "추가"}
                    </button>
                </div>
            </div>
        </div>
    );
}
