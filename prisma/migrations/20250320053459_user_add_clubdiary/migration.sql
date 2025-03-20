-- AddForeignKey
ALTER TABLE "ClubDiary" ADD CONSTRAINT "ClubDiary_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
