"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deletePlayer(playerId: number, clubId: number) {
    await db.player.delete({
        where: { id: playerId },
    });
    revalidatePath(`/playerList/${clubId}`);
}
