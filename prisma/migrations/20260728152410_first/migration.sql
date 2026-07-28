/*
  Warnings:

  - Made the column `createdAt` on table `ClubDiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `DogPlayer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `PlayerDiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Betting" DROP CONSTRAINT "Betting_clubid_fkey";

-- DropForeignKey
ALTER TABLE "Betting" DROP CONSTRAINT "Betting_gameid_fkey";

-- DropForeignKey
ALTER TABLE "Betting" DROP CONSTRAINT "Betting_userid_fkey";

-- DropForeignKey
ALTER TABLE "ClubDiary" DROP CONSTRAINT "ClubDiary_userid_fkey";

-- DropForeignKey
ALTER TABLE "DraftPick" DROP CONSTRAINT "DraftPick_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "DraftPick" DROP CONSTRAINT "DraftPick_playerId_fkey";

-- DropForeignKey
ALTER TABLE "DraftPick" DROP CONSTRAINT "DraftPick_userId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyGame" DROP CONSTRAINT "FantasyGame_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "FantasyGame" DROP CONSTRAINT "FantasyGame_player2Id_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_fantasyLeagueId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_mdId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_msId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_userId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_wcId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_wdId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_wsId_fkey";

-- DropForeignKey
ALTER TABLE "FantasyTeam" DROP CONSTRAINT "FantasyTeam_xdId_fkey";

-- DropForeignKey
ALTER TABLE "MatchDiary" DROP CONSTRAINT "MatchDiary_clubid_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_clubid_fkey";

-- DropForeignKey
ALTER TABLE "PlayerDiary" DROP CONSTRAINT "PlayerDiary_clubid_fkey";

-- DropForeignKey
ALTER TABLE "WaitGame" DROP CONSTRAINT "WaitGame_playerid_fkey";

-- DropForeignKey
ALTER TABLE "WaitPlayerList" DROP CONSTRAINT "WaitPlayerList_Playerid_fkey";

-- DropForeignKey
ALTER TABLE "_FantasyLeagueParticipants" DROP CONSTRAINT "_FantasyLeagueParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_FantasyLeagueParticipants" DROP CONSTRAINT "_FantasyLeagueParticipants_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserClubs" DROP CONSTRAINT "_UserClubs_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserClubs" DROP CONSTRAINT "_UserClubs_B_fkey";

-- AlterTable
ALTER TABLE "Betting" ADD COLUMN     "isHit" TEXT DEFAULT 'betting',
ALTER COLUMN "isCorrect" SET DEFAULT false,
ALTER COLUMN "isProcess" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ClubDiary" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "DogPlayer" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "isJoinLeague" SET DEFAULT false;

-- AlterTable
ALTER TABLE "PlayerDiary" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteClub" INTEGER[],
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JoinedClub" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JoinedClub_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PendingClubs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PendingClubs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JoinedClub_B_index" ON "_JoinedClub"("B");

-- CreateIndex
CREATE INDEX "_PendingClubs_B_index" ON "_PendingClubs"("B");
