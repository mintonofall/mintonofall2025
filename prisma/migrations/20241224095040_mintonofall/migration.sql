-- CreateTable
CREATE TABLE "GameBoard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubid" INTEGER NOT NULL,
    "CourtNumber" INTEGER NOT NULL,
    "player1id" INTEGER NOT NULL,
    "player2id" INTEGER NOT NULL,
    "player3id" INTEGER NOT NULL,
    "player4id" INTEGER NOT NULL
);
