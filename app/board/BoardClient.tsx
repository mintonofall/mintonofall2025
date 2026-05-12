"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createPost, createComment } from "./actions";

type Comment = {
    id: number;
    content: string;
    author: { userName: string | null; nickName: string | null };
    createdAt: Date;
};

type Post = {
    id: number;
    title: string;
    content: string;
    author: { userName: string | null; nickName: string | null };
    createdAt: Date;
    comments: Comment[];
};

export default function BoardClient({ currentUser, initialPosts }: { currentUser: string; initialPosts: Post[] }) {
    const [view, setView] = useState<"list" | "write" | "detail">("list");
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    // 폼 상태
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [comment, setComment] = useState("");

    const [isPending, startTransition] = useTransition();

    // 서버에서 받아온 initialPosts에서 현재 선택된 게시글 찾기
    const selectedPost = initialPosts.find((p) => p.id === selectedPostId) || null;

    // 날짜 포맷 함수
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // 게시글 작성 핸들러
    const handleWritePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        startTransition(async () => {
            const res = await createPost(title, content);
            if (res.success) {
                setTitle("");
                setContent("");
                setView("list");
            } else {
                alert(res.message || "작성에 실패했습니다.");
            }
        });
    };

    // 댓글 작성 핸들러
    const handleWriteComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !selectedPostId) return;

        startTransition(async () => {
            const res = await createComment(selectedPostId, comment);
            if (res.success) {
                setComment("");
            } else {
                alert(res.message || "댓글 작성에 실패했습니다.");
            }
        });
    };

    // 글쓰기 뷰
    if (view === "write") {
        return (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">새 게시글 작성</h2>
                <form onSubmit={handleWritePost} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="제목을 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2 h-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="내용을 입력하세요"
                        />
                    </div>
                    <div className="flex gap-2 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setView("list")}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {isPending ? "작성 중..." : "작성 완료"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // 상세 보기 뷰
    if (view === "detail" && selectedPost) {
        return (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <button onClick={() => setView("list")} className="text-blue-500 hover:underline mb-4 font-medium">
                    &larr; 목록으로 돌아가기
                </button>
                <h2 className="text-3xl font-bold mb-3">{selectedPost.title}</h2>
                <div className="text-sm text-gray-500 mb-6 border-b pb-4 flex justify-between">
                    <span>
                        작성자:{" "}
                        <span className="font-semibold">
                            {selectedPost.author?.nickName || selectedPost.author?.userName || "익명"}
                        </span>
                    </span>
                    <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
                <div className="min-h-[150px] mb-8 whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {selectedPost.content}
                </div>

                {/* 댓글 섹션 */}
                <div className="border-t pt-6">
                    <h3 className="text-xl font-bold mb-4">댓글 ({selectedPost.comments.length})</h3>
                    <div className="space-y-3 mb-6">
                        {selectedPost.comments.map((c) => (
                            <div key={c.id} className="bg-gray-50 p-4 rounded border border-gray-100">
                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <span className="font-bold text-gray-700">
                                        {c.author?.nickName || c.author?.userName || "익명"}
                                    </span>
                                    <span>{formatDate(c.createdAt)}</span>
                                </div>
                                <p className="text-gray-800">{c.content}</p>
                            </div>
                        ))}
                        {selectedPost.comments.length === 0 && (
                            <p className="text-gray-400 text-sm">첫 번째 댓글을 남겨보세요!</p>
                        )}
                    </div>
                    <form onSubmit={handleWriteComment} className="flex gap-2">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="댓글을 남겨보세요..."
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition font-medium disabled:opacity-50"
                        >
                            {isPending ? "등록 중..." : "등록"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // 목록 뷰 (기본)
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">모두의민턴 자유게시판</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView("write")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-medium"
                    >
                        글쓰기
                    </button>
                    <Link
                        href="/home"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition font-medium"
                    >
                        홈으로
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-gray-600">
                            <th className="p-4 w-16 text-center">번호</th>
                            <th className="p-4">제목</th>
                            <th className="p-4 w-28 text-center">작성자</th>
                            <th className="p-4 w-32 text-center">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialPosts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-500">
                                    게시글이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            initialPosts.map((post: Post, index: number) => (
                                <tr
                                    key={post.id}
                                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                                    onClick={() => {
                                        setSelectedPostId(post.id);
                                        setView("detail");
                                    }}
                                >
                                    <td className="p-4 text-center text-gray-400 font-medium">
                                        {initialPosts.length - index}
                                    </td>
                                    <td className="p-4 text-gray-800 font-medium">
                                        {post.title}
                                        {post.comments.length > 0 && (
                                            <span className="text-blue-500 text-sm ml-2 font-bold">
                                                [{post.comments.length}]
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center text-gray-600 text-sm">
                                        {post.author?.nickName || post.author?.userName || "익명"}
                                    </td>
                                    <td className="p-4 text-center text-gray-400 text-sm">
                                        {formatDate(post.createdAt)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
