-- CreateTable
CREATE TABLE "_FantasyLeagueParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FantasyLeagueParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FantasyLeagueParticipants_B_index" ON "_FantasyLeagueParticipants"("B");

-- AddForeignKey
ALTER TABLE "_FantasyLeagueParticipants" ADD CONSTRAINT "_FantasyLeagueParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "FantasyLeague"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FantasyLeagueParticipants" ADD CONSTRAINT "_FantasyLeagueParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
