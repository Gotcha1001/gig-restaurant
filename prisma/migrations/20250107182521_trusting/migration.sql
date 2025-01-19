/*
  Warnings:

  - You are about to drop the column `audioFiles` on the `Band` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Band" DROP COLUMN "audioFiles",
ADD COLUMN     "audioTracks" TEXT[];
