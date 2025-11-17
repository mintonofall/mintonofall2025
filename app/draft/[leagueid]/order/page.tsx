"use client";

import { getLeague, saveDraftOrder } from "@/app/actions";
import { useParams } from "next/navigation";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState, useTransition } from "react";

interface Participant {
    id: number;
    nickName: string;
}

export default function Order() {
    const params = useParams<{ leagueid: string }>();
    const leagueId = Number(params.leagueid);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [orderedParticipants, setOrderedParticipants] = useState<Participant[]>([]);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchLeague() {
            const league = await getLeague(leagueId);
            if (league) {
                setParticipants(league.participants);
                // 기존에 저장된 순서가 있다면 불러옵니다. (이전 응답의 draftOrder를 order로 수정)
                if (league.order && league.order.length > 0) {
                    const savedOrder = league.order
                        .map((id) => league.participants.find((p) => p.id === id))
                        .filter((p): p is Participant => p !== undefined);
                    setOrderedParticipants(savedOrder);
                    setIsShuffled(true);
                } else {
                    setOrderedParticipants(league.participants);
                }
            }
        }
        if (leagueId) {
            fetchLeague();
        }
    }, [leagueId]);

    const handleShuffle = () => {
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        setOrderedParticipants(shuffled);
        setIsShuffled(true);
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        const newOrderedParticipants = Array.from(orderedParticipants);
        const [reorderedItem] = newOrderedParticipants.splice(source.index, 1);
        newOrderedParticipants.splice(destination.index, 0, reorderedItem);

        setOrderedParticipants(newOrderedParticipants);
        setIsShuffled(true); // 수동으로 순서를 변경해도 저장 버튼이 활성화됩니다.
    };

    const handleSaveOrder = async () => {
        startTransition(async () => {
            await saveDraftOrder(leagueId, orderedParticipants);
        });
    };

    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-3xl font-bold mb-6">드래프트 순서 정하기</h1>
            <p className="mb-4 text-gray-600">참가자 이름을 드래그하여 순서를 변경할 수 있습니다.</p>
            <div className="max-w-md mx-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="participants">
                        {(provided) => (
                            <ol
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="list-decimal list-inside bg-white p-6 rounded-lg shadow-md text-left text-lg space-y-3 mb-6"
                            >
                                {orderedParticipants.map((p, index) => (
                                    <Draggable key={p.id} draggableId={p.id.toString()} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-3 rounded-md bg-gray-100 cursor-grab active:cursor-grabbing"
                                            >
                                                <span className="font-semibold">{index + 1}순위:</span> {p.nickName}
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ol>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="flex gap-4">
                    <button
                        onClick={handleShuffle}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        순서 섞기
                    </button>
                    <button
                        onClick={handleSaveOrder}
                        disabled={!isShuffled || isPending}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isPending ? "저장 중..." : "이 순서로 확정"}
                    </button>
                </div>
            </div>
        </div>
    );
}
