/*
  Warnings:

  - Added the required column `process` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FantasyLeague" ADD COLUMN     "process" TEXT NOT NULL;
