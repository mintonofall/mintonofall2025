-- CreateTable
CREATE TABLE "WaitPlayerList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubid" INTEGER NOT NULL,
    "Playerid" INTEGER NOT NULL,
    "enterDate" DATETIME NOT NULL,
    "exitDate" DATETIME
);
