/*
  Warnings:

  - You are about to drop the column `companyName` on the `CoverLetter` table. All the data in the column will be lost.
  - You are about to drop the column `jobDescription` on the `CoverLetter` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `CoverLetter` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `CoverLetter` table. All the data in the column will be lost.
  - The `jobRequirements` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `responsibilities` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CoverLetter" DROP COLUMN "companyName",
DROP COLUMN "jobDescription",
DROP COLUMN "jobTitle",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "coverLetterId" TEXT,
DROP COLUMN "jobRequirements",
ADD COLUMN     "jobRequirements" TEXT[],
DROP COLUMN "responsibilities",
ADD COLUMN     "responsibilities" TEXT[];
