import db from "@/lib/db";
import { getUser } from "@/lib/getUserGoHome";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Setting({ params }: { params: Promise<{ id: string }> }) {
    const user = await getUser();
    if (!user?.id) {
        redirect("/");
    }

    const { id } = await params;
    const clubId = Number(id);

    if (!id || isNaN(clubId)) {
        return (
            <div className="container mx-auto p-8 text-center mt-20">
                <h1 className="text-2xl font-bold text-red-500 mb-4">잘못된 접근입니다.</h1>
                <Link href="/home" className="text-blue-500 hover:underline">
                    홈으로 돌아가기
                </Link>
            </div>
        );
    }

    const club = await db.club.findUnique({
        where: { id: clubId },
        include: {
            pendingUsers: true,
        },
    });

    if (!club) {
        return (
            <div className="container mx-auto p-8 text-center mt-20">
                <h1 className="text-2xl font-bold text-red-500 mb-4">클럽을 찾을 수 없습니다.</h1>
                <Link href="/home" className="text-blue-500 hover:underline">
                    홈으로 돌아가기
                </Link>
            </div>
        );
    }

    // --- 서버 액션: 클럽 정보 업데이트 ---
    const updateClubSettings = async (formData: FormData) => {
        "use server";
        const description = formData.get("clubDescription") as string;
        const location = formData.get("clubLocation") as string;
        const courts = Number(formData.get("howManyCourts"));

        await db.club.update({
            where: { id: clubId },
            data: {
                clubDescription: description,
                clubLocation: location,
                howManyCourts: courts,
            },
        });
        revalidatePath(`/home/${clubId}/settings`);
    };

    // --- 서버 액션: 가입 승인 ---
    const approveUser = async (formData: FormData) => {
        "use server";
        const userId = Number(formData.get("userId"));

        await db.club.update({
            where: { id: clubId },
            data: {
                pendingUsers: {
                    disconnect: { id: userId },
                },
                joinedUsers: {
                    connect: { id: userId },
                },
            },
        });
        revalidatePath(`/home/${clubId}/settings`);
    };

    // --- 서버 액션: 가입 거절 ---
    const rejectUser = async (formData: FormData) => {
        "use server";
        const userId = Number(formData.get("userId"));

        await db.club.update({
            where: { id: clubId },
            data: {
                pendingUsers: {
                    disconnect: { id: userId },
                },
            },
        });
        revalidatePath(`/home/${clubId}/settings`);
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl mt-10 mb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">클럽 설정</h1>
                <Link href="/home" className="text-blue-500 hover:underline">
                    홈으로 돌아가기
                </Link>
            </div>

            {/* --- 클럽 정보 수정 폼 --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">기본 정보 수정</h2>
                <form action={updateClubSettings} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">클럽 이름</label>
                        <input
                            type="text"
                            value={club.clubName}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-500"
                        />
                        <span className="text-xs text-gray-400">클럽 이름은 변경할 수 없습니다.</span>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">클럽 소개</label>
                        <textarea
                            name="clubDescription"
                            defaultValue={club.clubDescription || ""}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">클럽 위치(지역)</label>
                        <input
                            type="text"
                            name="clubLocation"
                            defaultValue={club.clubLocation || ""}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">사용 코트 수</label>
                        <input
                            type="number"
                            name="howManyCourts"
                            defaultValue={club.howManyCourts}
                            min={1}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        설정 저장하기
                    </button>
                </form>
            </div>

            {/* --- 가입 신청 중인 유저 관리 --- */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">가입 신청 대기자 관리</h2>
                {club.pendingUsers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded">가입 대기 중인 유저가 없습니다.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {club.pendingUsers.map((applicant) => (
                            <div
                                key={applicant.id}
                                className="flex justify-between items-center p-4 bg-gray-50 border rounded shadow-sm"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg text-gray-800">{applicant.userName}</span>
                                    {applicant.nickName && (
                                        <span className="text-sm text-gray-500">닉네임: {applicant.nickName}</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <form action={approveUser}>
                                        <input type="hidden" name="userId" value={applicant.id} />
                                        <button
                                            type="submit"
                                            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
                                        >
                                            승인
                                        </button>
                                    </form>
                                    <form action={rejectUser}>
                                        <input type="hidden" name="userId" value={applicant.id} />
                                        <button
                                            type="submit"
                                            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
                                        >
                                            거절
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
