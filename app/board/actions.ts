"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/getUserGoHome";
import { revalidatePath } from "next/cache";

// 1. 게시글 목록 불러오기 (댓글과 작성자 정보 포함)
export async function getPosts() {
    try {
        const posts = await db.post.findMany({
            orderBy: {
                createdAt: "desc", // 최신 글이 위로 오도록 정렬
            },
            include: {
                author: {
                    select: {
                        userName: true,
                        nickName: true,
                    },
                },
                comments: {
                    orderBy: {
                        createdAt: "asc", // 댓글은 과거 순으로 정렬
                    },
                    include: {
                        author: {
                            select: {
                                userName: true,
                                nickName: true,
                            },
                        },
                    },
                },
            },
        });
        return posts;
    } catch (error) {
        console.error("게시글을 불러오는 중 에러 발생:", error);
        return [];
    }
}

// 2. 새 게시글 작성하기
export async function createPost(title: string, content: string) {
    const user = await getUser();
    if (!user?.id) {
        return { success: false, message: "로그인이 필요합니다." };
    }

    try {
        await db.post.create({
            data: {
                title,
                content,
                authorId: user.id,
            },
        });

        // 슬랙 웹훅으로 알림 전송
        const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (slackWebhookUrl) {
            try {
                await fetch(slackWebhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: `🔔 *모두의민턴 새 게시글 등록*\n*제목:* ${title}\n*작성자:* ${user.nickName || user.userName || "익명"}`,
                    }),
                });
            } catch (slackError) {
                console.error("슬랙 알림 전송 중 에러 발생:", slackError);
            }
        }

        revalidatePath("/board"); // 작성이 완료되면 게시판 페이지를 새로고침(캐시 초기화)
        return { success: true };
    } catch (error) {
        console.error("게시글 작성 중 에러 발생:", error);
        return { success: false, message: "게시글 작성에 실패했습니다." };
    }
}

// 3. 댓글 작성하기
export async function createComment(postId: number, content: string) {
    const user = await getUser();
    if (!user?.id) {
        return { success: false, message: "로그인이 필요합니다." };
    }

    try {
        await db.comment.create({ data: { content, postId, authorId: user.id } });
        revalidatePath("/board");
        return { success: true };
    } catch (error) {
        console.error("댓글 작성 중 에러 발생:", error);
        return { success: false, message: "댓글 작성에 실패했습니다." };
    }
}
