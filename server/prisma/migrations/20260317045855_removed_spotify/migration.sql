/*
  Warnings:

  - You are about to drop the column `spotifyId` on the `Song` table. All the data in the column will be lost.
  - Added the required column `deezerId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "spotifyId",
ADD COLUMN     "deezerId" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'deezer';
