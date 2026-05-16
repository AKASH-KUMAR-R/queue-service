-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "environment_id" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "environment_id" TEXT;

-- AlterTable
ALTER TABLE "JobEvents" ADD COLUMN     "environment_id" TEXT;

-- AlterTable
ALTER TABLE "ProjectInsights" ADD COLUMN     "environment_id" TEXT;

-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "environment_id" TEXT;

-- AlterTable
ALTER TABLE "QueueInsights" ADD COLUMN     "environment_id" TEXT;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvents" ADD CONSTRAINT "JobEvents_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueInsights" ADD CONSTRAINT "QueueInsights_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInsights" ADD CONSTRAINT "ProjectInsights_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
