"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { getLeagueForOrder, saveDraftOrder } from "./actions";
import { User } from "@prisma/client";

type LeagueData = {
    id: number;
    leagueName: string;
    participants: Pick<User, "id" | "nickName">[];
};

type DraftOrderPageProps = {
    params: { leagueid: string };
};

export default function DraftOrderPage({ params }: DraftOrderPageProps) {
    const leagueId = Number(params.leagueid);
    const [league, setLeague] = useState<LeagueData | null>(null);
    const [participants, setParticipants] = useState<Pick<User, "id" | "nickName">[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isNaN(leagueId)) return;

        getLeagueForOrder(leagueId)
            .then((data) => {
                if (data) {
                    setLeague(data);
                    setParticipants(data.participants);
                }
            })
            .finally(() => setLoading(false));
    }, [leagueId]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(participants);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setParticipants(items);
    };

    const handleRandomize = () => {
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        setParticipants(shuffled);
    };

    const handleSaveOrder = async () => {
        const orderedIds = participants.map((p) => p.id);
        await saveDraftOrder(leagueId, orderedIds);
    };

    if (loading) {
        return <div className="container mx-auto p-4 text-center">로딩 중...</div>;
    }

    if (!league) {
        return <div className="container mx-auto p-4 text-center">리그를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-2 text-center">{league.leagueName}</h1>
            <h2 className="text-xl text-gray-600 mb-6 text-center">드래프트 순서 정하기</h2>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={handleRandomize}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    랜덤으로 순서 정하기
                </button>
            </div>

            {isMounted ? (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="participants">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                {participants.map((participant, index) => (
                                    <Draggable key={participant.id} draggableId={String(participant.id)} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="flex items-center p-4 bg-white border rounded-lg shadow-sm"
                                            >
                                                <span className="text-lg font-bold w-8">{index + 1}.</span>
                                                <span className="flex-grow text-lg">{participant.nickName}</span>
                                                <Bars3Icon className="h-6 w-6 text-gray-400" />
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : null}

            <form action={handleSaveOrder} className="mt-8">
                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-md hover:bg-green-700"
                >
                    드래프트 시작
                </button>
            </form>
        </div>
    );
}
