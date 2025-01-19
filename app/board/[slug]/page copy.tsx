import db from "@/lib/db";
import { Player } from "@/lib/interface";
import Image from "next/image";
interface Board {
    id: number;
    clubid: number;
    players: Player[];
    updateTime: Date | null;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const clubid = Number(slug);
    let boardData: Board[] = [];
    const gameboards = async () => {
        const gameboards = await db.gameBoard.findMany({
            where: {
                clubid,
            },
        });

        const player1 = await db.player.findUnique({
            where: {
                id: gameboards[0].player1id,
            },
        });
        const player2 = await db.player.findUnique({
            where: {
                id: gameboards[0].player2id,
            },
        });
        const player3 = await db.player.findUnique({
            where: {
                id: gameboards[0].player3id,
            },
        });
        const player4 = await db.player.findUnique({
            where: {
                id: gameboards[0].player4id,
            },
        });
        const player5 = await db.player.findUnique({
            where: {
                id: gameboards[1].player1id,
            },
        });
        const player6 = await db.player.findUnique({
            where: {
                id: gameboards[1].player2id,
            },
        });
        const player7 = await db.player.findUnique({
            where: {
                id: gameboards[1].player3id,
            },
        });
        const player8 = await db.player.findUnique({
            where: {
                id: gameboards[1].player4id,
            },
        });
        const player9 = await db.player.findUnique({
            where: {
                id: gameboards[2].player1id,
            },
        });
        const player10 = await db.player.findUnique({
            where: {
                id: gameboards[2].player2id,
            },
        });
        const player11 = await db.player.findUnique({
            where: {
                id: gameboards[2].player3id,
            },
        });
        const player12 = await db.player.findUnique({
            where: {
                id: gameboards[2].player4id,
            },
        });
        // const player13 = await db.player.findUnique({
        //     where: {
        //         id: gameboards[3].player1id,
        //     },
        // });
        // const player14 = await db.player.findUnique({
        //     where: {
        //         id: gameboards[3].player2id,
        //     },
        // });
        // const player15 = await db.player.findUnique({
        //     where: {
        //         id: gameboards[3].player3id,
        //     },
        // });
        // const player16 = await db.player.findUnique({
        //     where: {
        //         id: gameboards[3].player4id,
        //     },
        // });
        boardData.push({
            id: gameboards[0].id,
            clubid: gameboards[0].clubid,
            players: [player1, player2, player3, player4].filter((player) => player !== null) as Player[],
            updateTime: gameboards[0].updateTime ?? null,
        });
        boardData.push({
            id: gameboards[1].id,
            clubid: gameboards[1].clubid,
            players: [player5, player6, player7, player8].filter((player) => player !== null) as Player[],
            updateTime: gameboards[1].updateTime ?? null,
        });
        boardData.push({
            id: gameboards[2].id,
            clubid: gameboards[2].clubid,
            players: [player9, player10, player11, player12].filter((player) => player !== null) as Player[],
            updateTime: gameboards[2].updateTime ?? null,
        });
        // boardData.push({
        //     id: gameboards[3].id,
        //     clubid: gameboards[3].clubid,
        //     players: [player13, player14, player15, player16].filter((player) => player !== null) as Player[],
        //     updateTime: gameboards[3].updateTime ?? null,
        // });
        return boardData;
    };
    const gameBoardData: Board[] = await gameboards();

    console.log(gameBoardData);
    return (
        <>
            {gameBoardData.map((game: Board, idx: number) => {
                return (
                    <div key={idx} className="flex justify-between">
                        <div>
                            <Image src={`${game.players[0].avater}/avatar`} width={100} height={100} alt="avtar" />
                            {game.players[0].name}
                        </div>
                        <div>
                            <Image src={`${game.players[1].avater}/avatar`} width={100} height={100} alt="avtar" />
                            {game.players[1].name}
                        </div>
                        <div>
                            <Image src={`${game.players[2].avater}/avatar`} width={100} height={100} alt="avtar" />
                            {game.players[2].name}
                        </div>
                        <div>
                            <Image src={`${game.players[3].avater}/avatar`} width={100} height={100} alt="avtar" />
                            {game.players[3].name}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
