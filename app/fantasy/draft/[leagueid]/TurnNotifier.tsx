"use client";

import { useEffect, useRef } from "react";

interface TurnNotifierProps {
    isCurrentUserTurn: boolean;
}

export default function TurnNotifier({ isCurrentUserTurn }: TurnNotifierProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevIsMyTurn = useRef(isCurrentUserTurn);

    useEffect(() => {
        // 브라우저 환경에서만 Audio 객체를 생성합니다.
        if (!audioRef.current) {
            audioRef.current = new Audio("/sounds/your-turn.mp3"); // public 폴더의 사운드 파일 경로
        }

        // 이전 상태는 '내 차례 아님'이었고, 현재 상태가 '내 차례'일 때 소리를 재생합니다.
        if (isCurrentUserTurn && !prevIsMyTurn.current) {
            audioRef.current?.play().catch((error) => console.error("오디오 재생에 실패했습니다:", error));
        }

        // 다음 렌더링을 위해 현재 상태를 저장합니다.
        prevIsMyTurn.current = isCurrentUserTurn;
    }, [isCurrentUserTurn]);

    return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}
