-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "avater" TEXT,
    "clubid" INTEGER NOT NULL,
    "suttlePoint" INTEGER NOT NULL DEFAULT 10000,
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "games" INTEGER NOT NULL DEFAULT 0,
    "mmr" INTEGER NOT NULL DEFAULT 1000,
    CONSTRAINT "Player_clubid_fkey" FOREIGN KEY ("clubid") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("age", "avater", "clubid", "games", "grade", "id", "lose", "mmr", "name", "suttlePoint", "win") SELECT "age", "avater", "clubid", "games", "grade", "id", "lose", "mmr", "name", "suttlePoint", "win" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
