-- AlterTable
ALTER TABLE "Betting" ADD COLUMN     "WinnerIds" INTEGER[],
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isProcess" BOOLEAN NOT NULL DEFAULT false;
