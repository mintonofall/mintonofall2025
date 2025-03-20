-- CreateTable
CREATE TABLE "ClubDiary" (
    "id" SERIAL NOT NULL,
    "clubName" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "ClubDiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubPlayer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "avater" TEXT,

    CONSTRAINT "ClubPlayer_pkey" PRIMARY KEY ("id")
);
