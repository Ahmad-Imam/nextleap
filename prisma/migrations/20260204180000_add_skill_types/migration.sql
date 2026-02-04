-- Add per-user custom skill type options
ALTER TABLE "User"
ADD COLUMN "skillTypes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
