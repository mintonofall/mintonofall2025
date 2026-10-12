"use client";

import { useState } from "react";

export default function MyQrCode({ userName }: { userName: string }) {
    const [showQR, setShowQR] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowQR(true)}
                className="text-blue-500 hover:text-blue-700 font-semibold text-lg"
            >
                내 궁합 QR코드
            </button>

            {showQR && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowQR(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            onClick={() => setShowQR(false)}
                        >
                            <span className="text-2xl pb-1">×</span>
                        </button>
                        <h2 className="text-xl font-bold mt-2">내 궁합 QR코드</h2>
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                typeof window !== "undefined"
                                    ? `${window.location.origin}/guhap/${encodeURIComponent(userName)}`
                                    : "",
                            )}`}
                            alt="내 궁합 QR코드"
                            width={200}
                            height={200}
                        />
                        <p className="text-sm text-gray-500 text-center">
                            상대방이 이 QR코드를 스캔하면
                            <br />
                            나와의 궁합을 바로 볼 수 있어요.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
