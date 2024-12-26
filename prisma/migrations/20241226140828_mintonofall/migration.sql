-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 10000,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "clubName" TEXT NOT NULL,
    "clubLogo" TEXT,
    "clubDescription" TEXT,
    "clubLocation" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'man',
    "age" INTEGER NOT NULL,
    "avater" TEXT,
    "clubid" INTEGER NOT NULL,
    "suttlePoint" INTEGER NOT NULL DEFAULT 10000,
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "games" INTEGER NOT NULL DEFAULT 0,
    "mmr" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitPlayerList" (
    "id" SERIAL NOT NULL,
    "clubid" INTEGER NOT NULL,
    "Playerid" INTEGER NOT NULL,
    "enterDate" TIMESTAMP(3) NOT NULL,
    "exitDate" TIMESTAMP(3),

    CONSTRAINT "WaitPlayerList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitGame" (
    "id" SERIAL NOT NULL,
    "clubid" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,

    CONSTRAINT "WaitGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "player1id" INTEGER NOT NULL,
    "player2id" INTEGER NOT NULL,
    "player3id" INTEGER NOT NULL,
    "player4id" INTEGER NOT NULL,
    "clubid" INTEGER NOT NULL,
    "winner1id" INTEGER,
    "winner2id" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "score1" INTEGER,
    "score2" INTEGER,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameBoard" (
    "id" SERIAL NOT NULL,
    "gameid" INTEGER,
    "clubid" INTEGER NOT NULL,
    "CourtNumber" INTEGER NOT NULL,
    "player1id" INTEGER NOT NULL,
    "player2id" INTEGER NOT NULL,
    "player3id" INTEGER NOT NULL,
    "player4id" INTEGER NOT NULL,

    CONSTRAINT "GameBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserClubs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserClubs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Club_clubName_key" ON "Club"("clubName");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE INDEX "_UserClubs_B_index" ON "_UserClubs"("B");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_clubid_fkey" FOREIGN KEY ("clubid") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitPlayerList" ADD CONSTRAINT "WaitPlayerList_Playerid_fkey" FOREIGN KEY ("Playerid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClubs" ADD CONSTRAINT "_UserClubs_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClubs" ADD CONSTRAINT "_UserClubs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
