/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "isFavorite",
ADD COLUMN     "isBookmark" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "education" JSONB[],
ADD COLUMN     "experience" JSONB[],
ADD COLUMN     "proj" JSONB[];
