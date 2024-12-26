-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1id" INTEGER NOT NULL,
    "player2id" INTEGER NOT NULL,
    "player3id" INTEGER NOT NULL,
    "player4id" INTEGER NOT NULL,
    "clubid" INTEGER NOT NULL,
    "winner1id" INTEGER,
    "winner2id" INTEGER,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "score1" INTEGER,
    "score2" INTEGER
);
INSERT INTO "new_Match" ("clubid", "duration", "endTime", "id", "player1id", "player2id", "player3id", "player4id", "score1", "score2", "startTime", "winner1id", "winner2id") SELECT "clubid", "duration", "endTime", "id", "player1id", "player2id", "player3id", "player4id", "score1", "score2", "startTime", "winner1id", "winner2id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
