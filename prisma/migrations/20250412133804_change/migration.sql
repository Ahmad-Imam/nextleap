-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeline" JSONB[];
