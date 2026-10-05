-- CreateTable
CREATE TABLE "PlayerEditRequest" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "clubid" INTEGER NOT NULL,
    "name" TEXT,
    "age" INTEGER,
    "grade" TEXT,
    "gender" TEXT,
    "photo" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerEditRequest_pkey" PRIMARY KEY ("id")
);
