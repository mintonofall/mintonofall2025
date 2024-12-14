/*
  Warnings:

  - You are about to drop the `UserClub` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserClub";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_UserClubs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserClubs_A_fkey" FOREIGN KEY ("A") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserClubs_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserClubs_AB_unique" ON "_UserClubs"("A", "B");

-- CreateIndex
CREATE INDEX "_UserClubs_B_index" ON "_UserClubs"("B");
