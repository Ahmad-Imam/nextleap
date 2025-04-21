/*
  Warnings:

  - You are about to drop the `CoverLetter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CoverLetter" DROP CONSTRAINT "CoverLetter_jobId_fkey";

-- DropForeignKey
ALTER TABLE "CoverLetter" DROP CONSTRAINT "CoverLetter_userId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "coverLetter" TEXT;

-- DropTable
DROP TABLE "CoverLetter";
