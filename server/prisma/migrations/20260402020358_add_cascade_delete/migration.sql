-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_playerId_fkey";

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
