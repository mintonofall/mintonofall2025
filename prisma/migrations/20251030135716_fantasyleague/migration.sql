-- CreateEnum
CREATE TYPE "GameEvent" AS ENUM ('MS', 'WS', 'MD', 'WD', 'XD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nickName" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "FantasyTeam" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fantasyLeagueId" INTEGER NOT NULL,

    CONSTRAINT "FantasyTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FantasyPlayer" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "event" "GameEvent" NOT NULL,
    "ranking" INTEGER NOT NULL,

    CONSTRAINT "FantasyPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FantasyGame" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "gameResult" INTEGER[],

    CONSTRAINT "FantasyGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FantasyLeague" (
    "id" SERIAL NOT NULL,
    "leagueName" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "FantasyLeague_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyTeam" ADD CONSTRAINT "FantasyTeam_fantasyLeagueId_fkey" FOREIGN KEY ("fantasyLeagueId") REFERENCES "FantasyLeague"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyGame" ADD CONSTRAINT "FantasyGame_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "FantasyPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FantasyGame" ADD CONSTRAINT "FantasyGame_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "FantasyPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
