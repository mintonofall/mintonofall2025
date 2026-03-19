/*
  Warnings:

  - Added the required column `userid` to the `Betting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Betting" ADD COLUMN     "userid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Betting" ADD CONSTRAINT "Betting_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
