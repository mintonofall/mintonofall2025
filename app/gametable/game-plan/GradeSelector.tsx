"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function GradeSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const grade = searchParams.get("grade");
    const gender = searchParams.get("gender");
    const currentValue = grade || gender || "all";

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        // 기존 필터 초기화
        params.delete("grade");
        params.delete("gender");

        if (val === "all") {
            // 전체보기 (아무것도 설정하지 않음)
        } else if (val === "man" || val === "woman") {
            params.set("gender", val);
        } else {
            params.set("grade", val);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <select
            value={currentValue}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-1 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="all">전체 보기</option>
            <optgroup label="성별">
                <option value="man">남성</option>
                <option value="woman">여성</option>
            </optgroup>
            <optgroup label="급수">
                {["A", "B", "C", "D", "E"].map((g) => (
                    <option key={g} value={g}>
                        {g}조
                    </option>
                ))}
            </optgroup>
        </select>
    );
}
