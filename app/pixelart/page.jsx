"use client";

import React, { useState } from "react";

export default function AIPixelConverter() {
    const [isLoading, setIsLoading] = useState(false);
    const [pixelImage, setPixelImage] = useState(null);

    // 파일 선택 시 바로 AI API 호출
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setPixelImage(null); // 이전 결과 초기화

        // 파일을 Base64 문자열로 변환 (API 전송용)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64data = reader.result;

            try {
                // 우리가 만든 Next.js API 호출
                const response = await fetch("/api/pixelate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64data }),
                });

                const data = await response.json();

                if (response.ok) {
                    setPixelImage(data.resultUrl); // AI가 만들어준 이미지 URL 저장
                } else {
                    alert("변환 실패: " + data.error);
                }
            } catch (error) {
                alert("에러 발생!");
            } finally {
                setIsLoading(false);
            }
        };
    };

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>🤖 AI 고퀄리티 도트 아바타 생성기</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isLoading}
                style={{ marginBottom: "20px" }}
            />

            {/* 로딩 중 표시 */}
            {isLoading && <p>AI가 열심히 도트를 찍고 있습니다... (약 10~20초 소요)</p>}

            {/* 결과 이미지 표시 */}
            {pixelImage && (
                <div style={{ border: "2px solid #000", padding: "5px", background: "#eee" }}>
                    <img
                        src={pixelImage}
                        alt="AI Pixel Art"
                        style={{ maxWidth: "300px", height: "auto", imageRendering: "pixelated" }}
                    />
                </div>
            )}

            {!isLoading && !pixelImage && <p style={{ color: "gray" }}>사진을 올리면 AI가 변환을 시작합니다.</p>}
        </div>
    );
}
