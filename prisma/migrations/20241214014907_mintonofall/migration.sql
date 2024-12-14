-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubName" TEXT NOT NULL,
    "clubLogo" TEXT,
    "clubDescription" TEXT,
    "clubLocation" TEXT,
    "clubOwnerId" INTEGER NOT NULL,
    CONSTRAINT "Club_clubOwnerId_fkey" FOREIGN KEY ("clubOwnerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "avater" TEXT,
    "clubid" INTEGER NOT NULL,
    "suttlePoint" INTEGER NOT NULL DEFAULT 10000,
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "games" INTEGER NOT NULL DEFAULT 0,
    "mmr" INTEGER NOT NULL DEFAULT 1000
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_clubName_key" ON "Club"("clubName");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
