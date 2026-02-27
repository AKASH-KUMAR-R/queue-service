-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "producer_id" TEXT;

-- AlterTable
ALTER TABLE "JobEvents" ALTER COLUMN "worker_id" DROP NOT NULL;
