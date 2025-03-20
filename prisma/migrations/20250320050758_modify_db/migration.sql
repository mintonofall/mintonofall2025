/*
  Warnings:

  - You are about to drop the `ClubPlayer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ClubPlayer";

-- CreateTable
CREATE TABLE "PlayerDiary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "avater" TEXT,
    "clubid" INTEGER NOT NULL,
    "mmr" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "PlayerDiary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerDiary" ADD CONSTRAINT "PlayerDiary_clubid_fkey" FOREIGN KEY ("clubid") REFERENCES "ClubDiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
