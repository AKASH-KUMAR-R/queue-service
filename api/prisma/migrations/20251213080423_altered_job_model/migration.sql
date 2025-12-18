-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "scheduled_at" TIMESTAMP(3);
