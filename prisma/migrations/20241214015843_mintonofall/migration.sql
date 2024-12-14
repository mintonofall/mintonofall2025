/*
  Warnings:

  - You are about to drop the column `clubOwnerId` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `clubId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserClub" (
    "userId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "clubId"),
    CONSTRAINT "UserClub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserClub_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubName" TEXT NOT NULL,
    "clubLogo" TEXT,
    "clubDescription" TEXT,
    "clubLocation" TEXT
);
INSERT INTO "new_Club" ("clubDescription", "clubLocation", "clubLogo", "clubName", "id") SELECT "clubDescription", "clubLocation", "clubLogo", "clubName", "id" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE UNIQUE INDEX "Club_clubName_key" ON "Club"("clubName");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "password", "userName") SELECT "id", "password", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
