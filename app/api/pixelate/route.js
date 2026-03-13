// app/api/pixelate/route.js
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
    try {
        const { image } = await request.json(); // 프론트에서 보낸 이미지 데이터(Base64)

        // ⭐️ 핵심: AI 모델에게 "이 사진을 픽셀아트로 바꿔줘"라고 요청
        // 여기서는 SDXL 모델을 사용하며, 프롬프트로 픽셀아트 스타일을 강력하게 주입합니다.
        const output = await replicate.run(
            "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
            {
                input: {
                    image: image, // 사용자가 업로드한 이미지
                    prompt: "turn into pixel art style, 8-bit game character portrait, retro video game", // 픽셀아트 스타일을 요구하는 주문
                    image_guidance_scale: 1.5, // 원본 이미지의 구조를 얼마나 유지할지 (높을수록 원본 형태 유지)
                    num_inference_steps: 20, // AI가 고민하는 횟수
                },
            },
        );

        // output은 생성된 이미지 URL의 배열입니다.
        return NextResponse.json({ resultUrl: output[0] });
    } catch (error) {
        console.error("AI 변환 실패:", error);
        return NextResponse.json({ error: error.message || "이미지 변환 중 오류가 발생했습니다." }, { status: 500 });
    }
}
