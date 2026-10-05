-- CreateTable
CREATE TABLE "MemberMessage" (
    "id" SERIAL NOT NULL,
    "clubid" INTEGER NOT NULL,
    "userId" INTEGER,
    "userName" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberMessage_pkey" PRIMARY KEY ("id")
);
