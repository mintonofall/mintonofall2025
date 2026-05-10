"use client";

export default function JoinClubForm({
    clubId,
    requestJoin,
}: {
    clubId: number;
    requestJoin: (formData: FormData) => void;
}) {
    return (
        <form
            action={requestJoin}
            onSubmit={(e) => {
                if (!window.confirm("정말 가입하시겠습니까?")) {
                    e.preventDefault();
                }
            }}
        >
            <input type="hidden" name="clubId" value={clubId} />
            <button type="submit" className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition">
                가입신청
            </button>
        </form>
    );
}
