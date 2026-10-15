-- AlterTable
ALTER TABLE "CompatibilityCheck" ADD COLUMN     "commScore" INTEGER,
ADD COLUMN     "playScore" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "style" JSONB;
