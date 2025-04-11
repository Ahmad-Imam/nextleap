/*
  Warnings:

  - You are about to drop the column `description` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Job` table. All the data in the column will be lost.
  - Added the required column `jobDescription` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "description",
DROP COLUMN "requirements",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "applicationLink" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "jobRequirements" TEXT,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "jobType" TEXT,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "responsibilities" TEXT;
