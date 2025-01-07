/*
  Warnings:

  - The `gameDatas` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "gameDatas",
ADD COLUMN     "gameDatas" TIMESTAMP(3)[];
