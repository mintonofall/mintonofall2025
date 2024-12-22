/*
  Warnings:

  - You are about to drop the column `player1id` on the `WaitGame` table. All the data in the column will be lost.
  - Added the required column `playerid` to the `WaitGame` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WaitGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubid" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    "point" INTEGER NOT NULL
);
INSERT INTO "new_WaitGame" ("clubid", "id", "point") SELECT "clubid", "id", "point" FROM "WaitGame";
DROP TABLE "WaitGame";
ALTER TABLE "new_WaitGame" RENAME TO "WaitGame";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
