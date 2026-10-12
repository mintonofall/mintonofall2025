-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "birthCalendarType" TEXT,
ADD COLUMN     "birthDay" INTEGER,
ADD COLUMN     "birthHour" INTEGER,
ADD COLUMN     "birthIsLeapMonth" BOOLEAN,
ADD COLUMN     "birthMonth" INTEGER,
ADD COLUMN     "birthYear" INTEGER,
ADD COLUMN     "linkedUserId" INTEGER,
ADD COLUMN     "mbti" TEXT,
ADD COLUMN     "saju" JSONB;
