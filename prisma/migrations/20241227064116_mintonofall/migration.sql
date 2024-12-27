-- AddForeignKey
ALTER TABLE "WaitGame" ADD CONSTRAINT "WaitGame_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
