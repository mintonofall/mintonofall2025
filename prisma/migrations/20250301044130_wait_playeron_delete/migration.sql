-- DropForeignKey
ALTER TABLE "WaitPlayerList" DROP CONSTRAINT "WaitPlayerList_Playerid_fkey";

-- AddForeignKey
ALTER TABLE "WaitPlayerList" ADD CONSTRAINT "WaitPlayerList_Playerid_fkey" FOREIGN KEY ("Playerid") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
