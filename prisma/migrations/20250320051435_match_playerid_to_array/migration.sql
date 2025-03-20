/*
  Warnings:

  - You are about to drop the column `player1id` on the `MatchDiary` table. All the data in the column will be lost.
  - You are about to drop the column `player2id` on the `MatchDiary` table. All the data in the column will be lost.
  - You are about to drop the column `player3id` on the `MatchDiary` table. All the data in the column will be lost.
  - You are about to drop the column `player4id` on the `MatchDiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchDiary" DROP COLUMN "player1id",
DROP COLUMN "player2id",
DROP COLUMN "player3id",
DROP COLUMN "player4id",
ADD COLUMN     "players" INTEGER[];
