-- CreateTable
CREATE TABLE "Betting" (
    "id" SERIAL NOT NULL,
    "clubid" INTEGER NOT NULL,
    "gameid" INTEGER NOT NULL,
    "betWinner" INTEGER[],
    "betCoast" INTEGER NOT NULL,

    CONSTRAINT "Betting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Betting" ADD CONSTRAINT "Betting_clubid_fkey" FOREIGN KEY ("clubid") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Betting" ADD CONSTRAINT "Betting_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
