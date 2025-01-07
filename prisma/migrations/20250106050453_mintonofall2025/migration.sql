/*
  Warnings:

  - A unique constraint covering the columns `[gameid]` on the table `GameBoard` will be added. If there are existing duplicate values, this will fail.
  - Made the column `gameid` on table `GameBoard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GameBoard" ALTER COLUMN "gameid" SET NOT NULL,
ALTER COLUMN "gameid" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GameBoard_gameid_key" ON "GameBoard"("gameid");
