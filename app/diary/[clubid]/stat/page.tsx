"use client";
import { getWin } from "@/lib/getClubDiary";
import getSessionClient from "@/lib/sessionClient";
import { Doughnut } from "react-chartjs-2"; // Keep this import
import { Chart, registerables } from "chart.js"; // Import Chart and registerables
Chart.register(...registerables); // Register all controllers, elements, scales, and plugins
import { useEffect, useState } from "react";

export default function StatHome({ params }: { params: Promise<{ userid: number }> }) {
    const [userid, setUserid] = useState(0);
    const [wins, setWins] = useState<number[]>([]);
    useEffect(() => {
        async function fetchParams() {
            const session = await getSessionClient();
            setUserid(Number(session!.id));
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        async function fetchMatch() {
            const matchs = await getWin(userid);
            console.log(matchs);
            setWins(matchs);
        }
        fetchMatch();
    }, [userid]);

    return (
        <div>
            stat home{userid}
            <div>
                {wins[0]}승 {wins[1]}패
            </div>
            <div>{wins[2]} 득점</div>
            <div>{wins[3]} 실점</div>
            {wins.length > 0 && (
                <Doughnut
                    data={{
                        labels: ["Wins", "Losses"],
                        datasets: [
                            {
                                label: "Matches",
                                data: [wins[0], wins[1]],
                                backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
                            },
                        ],
                    }}
                    options={{
                        rotation: 270, // 반시계 방향으로 시작 각도 설정
                        circumference: 360, // 전체 원을 그림
                        plugins: {
                            legend: {
                                position: "bottom",
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = context.label || "";
                                        const value = context.formattedValue;
                                        return `${label}: ${value} 경기`;
                                    },
                                },
                            },
                        },
                    }}
                />
            )}
        </div>
    );
}
