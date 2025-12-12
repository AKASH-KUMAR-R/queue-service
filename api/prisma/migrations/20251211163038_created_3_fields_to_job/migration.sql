-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "heartbeated_at" TIMESTAMP(3),
ADD COLUMN     "started_at" TIMESTAMP(3),
ADD COLUMN     "timeout_ms" INTEGER;
