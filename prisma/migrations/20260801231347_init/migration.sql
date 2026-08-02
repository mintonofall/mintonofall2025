/*
  Warnings:

  - Made the column `createdAt` on table `DogGames` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `DogGames` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastGameDate` on table `DogPlayer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `FantasyGame` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `FantasyLeague` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `FantasyPlayer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `FantasyTeam` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updateTime` on table `GameBoard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `MatchDiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `MatchDiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastGameDate` on table `PlayerDiary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updateTime` on table `WaitGame` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exitDate` on table `WaitPlayerList` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DogGames" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "DogPlayer" ALTER COLUMN "lastGameDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "FantasyGame" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "FantasyLeague" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "FantasyPlayer" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "FantasyTeam" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "GameBoard" ALTER COLUMN "updateTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "endTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "MatchDiary" ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "PlayerDiary" ALTER COLUMN "lastGameDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "WaitGame" ALTER COLUMN "updateTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "WaitPlayerList" ALTER COLUMN "exitDate" SET NOT NULL;
