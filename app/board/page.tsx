import { getUser } from "@/lib/getUserGoHome";
import BoardClient from "./BoardClient";
import { getPosts } from "./actions";

export default async function BoardPage() {
    const user = await getUser();
    const posts = await getPosts();

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <BoardClient currentUser={user?.userName || "익명"} initialPosts={posts} />
            </div>
        </div>
    );
}
