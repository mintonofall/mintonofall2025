-- CreateTable
CREATE TABLE "DogPlayer" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER,
    "name" TEXT NOT NULL,
    "grade" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "where" TEXT,
    "avater" TEXT,
    "mmr" INTEGER NOT NULL DEFAULT 1000,
    "games" INTEGER[],
    "winGames" INTEGER[],
    "gameNum" INTEGER NOT NULL DEFAULT 0,
    "winNum" INTEGER NOT NULL DEFAULT 0,
    "lastGameDate" TIMESTAMP(3),
    "createat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DogPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogGames" (
    "id" SERIAL NOT NULL,
    "Players" INTEGER[],
    "WinPlayer" INTEGER[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DogGames_pkey" PRIMARY KEY ("id")
);
