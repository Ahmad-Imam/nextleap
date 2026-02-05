-- Add submitted application limits per user
ALTER TABLE "User"
ADD COLUMN "weeklyApplicationLimit" INTEGER,
ADD COLUMN "monthlyApplicationLimit" INTEGER;

-- Add free-form notes per tracked job
ALTER TABLE "Job"
ADD COLUMN "notes" TEXT;
