/*
  Warnings:

  - Made the column `age` on table `DogPlayer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DogPlayer" ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "age" SET DEFAULT 40;
