-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_clubid_fkey";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_clubid_fkey" FOREIGN KEY ("clubid") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
