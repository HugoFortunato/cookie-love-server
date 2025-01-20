-- AddForeignKey
ALTER TABLE "SharedPhrase" ADD CONSTRAINT "SharedPhrase_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
