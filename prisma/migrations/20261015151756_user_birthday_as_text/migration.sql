-- AlterTable
ALTER TABLE "User" ALTER COLUMN "birthday" SET DATA TYPE TEXT USING to_char("birthday", 'YYYYMMDD');
