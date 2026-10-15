"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSessionClient from "@/lib/sessionClient";
import { revalidatePath } from "next/cache";
import { MBTI_DESCRIPTIONS } from "@/lib/mbtiQuestions";

const VALID_MBTI_TYPES = new Set(Object.keys(MBTI_DESCRIPTIONS));

export async function updateMyInfo(prevState: unknown, formData: FormData) {
    const session = await getSessionClient();
    if (!session?.id) {
        return { error: "로그인이 필요합니다." };
    }
    const userId = session.id;

    const nickName = (formData.get("nickName") as string)?.trim();
    const mbtiInput = (formData.get("mbti") as string)?.trim();
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const newPasswordConfirm = formData.get("newPasswordConfirm") as string;

    if (!nickName) {
        return { error: "닉네임을 입력해주세요." };
    }
    if (mbtiInput && !VALID_MBTI_TYPES.has(mbtiInput)) {
        return { error: "올바른 MBTI 유형이 아닙니다." };
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
        return { error: "사용자 정보를 찾을 수 없습니다." };
    }

    const data: { nickName: string; mbti: string | null; password?: string } = {
        nickName,
        mbti: mbtiInput || null,
    };

    // 비밀번호 변경을 시도한 경우에만 검증합니다 (세 칸 중 하나라도 입력했으면 변경 시도로 간주).
    const wantsPasswordChange = currentPassword || newPassword || newPasswordConfirm;
    if (wantsPasswordChange) {
        if (!currentPassword || !newPassword || !newPasswordConfirm) {
            return { error: "비밀번호를 변경하려면 현재 비밀번호와 새 비밀번호를 모두 입력해주세요." };
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return { error: "현재 비밀번호가 일치하지 않습니다." };
        }
        if (newPassword !== newPasswordConfirm) {
            return { error: "새 비밀번호가 일치하지 않습니다." };
        }
        if (newPassword.length < 4) {
            return { error: "새 비밀번호는 4자 이상이어야 합니다." };
        }
        data.password = await bcrypt.hash(newPassword, 10);
    }

    await db.user.update({
        where: { id: userId },
        data,
    });

    revalidatePath("/mypage");
    return { success: true, passwordChanged: wantsPasswordChange };
}

type UploadURLResult =
    | { error: string }
    | { success: true; result: { uploadURL: string; id: string } };

export async function getProfileImageUploadURL(): Promise<UploadURLResult> {
    const session = await getSessionClient();
    if (!session?.id) {
        return { error: "로그인이 필요합니다." };
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
            },
        },
    );
    const data = await response.json();
    return { success: true, result: data.result };
}

export async function updateProfileImage(imageURL: string): Promise<{ error: string } | { success: true }> {
    const session = await getSessionClient();
    if (!session?.id) {
        return { error: "로그인이 필요합니다." };
    }

    await db.user.update({
        where: { id: session.id },
        data: { profileImage: imageURL },
    });

    revalidatePath("/mypage");
    return { success: true as const };
}
