/*
  Warnings:

  - A unique constraint covering the columns `[msId]` on the table `FantasyTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wsId]` on the table `FantasyTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mdId]` on the table `FantasyTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wdId]` on the table `FantasyTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xdId]` on the table `FantasyTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wcId]` on the table `FantasyTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "GameEvent" ADD VALUE 'WC';

-- AlterTable
ALTER TABLE "FantasyTeam" ADD COLUMN     "mdId" INTEGER,
ADD COLUMN     "msId" INTEGER,
ADD COLUMN     "wcId" INTEGER,
ADD COLUMN     "wdId" INTEGER,
ADD COLUMN     "wsId" INTEGER,
ADD COLUMN     "xdId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_msId_key" ON "FantasyTeam"("msId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_wsId_key" ON "FantasyTeam"("wsId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_mdId_key" ON "FantasyTeam"("mdId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_wdId_key" ON "FantasyTeam"("wdId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_xdId_key" ON "FantasyTeam"("xdId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_wcId_key" ON "FantasyTeam"("wcId");

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_msId_fkey" FOREIGN KEY ("msId") REFERENCES "FantasyPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_wsId_fkey" FOREIGN KEY ("wsId") REFERENCES "FantasyPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_mdId_fkey" FOREIGN KEY ("mdId") REFERENCES "FantasyPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_wdId_fkey" FOREIGN KEY ("wdId") REFERENCES "FantasyPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_xdId_fkey" FOREIGN KEY ("xdId") REFERENCES "FantasyPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_wcId_fkey" FOREIGN KEY ("wcId") REFERENCES "FantasyPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
