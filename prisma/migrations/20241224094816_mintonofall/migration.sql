-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1id" INTEGER NOT NULL,
    "player2id" INTEGER NOT NULL,
    "player3id" INTEGER NOT NULL,
    "player4id" INTEGER NOT NULL,
    "clubid" INTEGER NOT NULL,
    "winner1id" INTEGER NOT NULL,
    "winner2id" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER NOT NULL,
    "score1" INTEGER,
    "score2" INTEGER
);
