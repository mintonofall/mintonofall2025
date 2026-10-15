-- CreateTable
CREATE TABLE "CompatibilityCheck" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "partnerUserId" INTEGER NOT NULL,
    "partnerUserName" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "memo" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompatibilityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompatibilityCheck_userId_idx" ON "CompatibilityCheck"("userId");

-- CreateIndex
CREATE INDEX "CompatibilityCheck_partnerUserId_idx" ON "CompatibilityCheck"("partnerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "CompatibilityCheck_userId_partnerUserId_key" ON "CompatibilityCheck"("userId", "partnerUserId");
