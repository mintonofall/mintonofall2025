-- CreateTable
CREATE TABLE "MatchDiary" (
    "id" SERIAL NOT NULL,
    "gameid" TEXT NOT NULL,
    "player1id" INTEGER NOT NULL,
    "player2id" INTEGER NOT NULL,
    "player3id" INTEGER NOT NULL,
    "player4id" INTEGER NOT NULL,
    "clubid" INTEGER NOT NULL,
    "winner1id" INTEGER,
    "winner2id" INTEGER,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "score1" INTEGER,
    "score2" INTEGER,

    CONSTRAINT "MatchDiary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchDiary" ADD CONSTRAINT "MatchDiary_clubid_fkey" FOREIGN KEY ("clubid") REFERENCES "ClubDiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
