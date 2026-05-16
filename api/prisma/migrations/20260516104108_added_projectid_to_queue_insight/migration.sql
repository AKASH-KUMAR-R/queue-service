-- AlterTable
ALTER TABLE "QueueInsights" ADD COLUMN     "project_id" TEXT;

-- AddForeignKey
ALTER TABLE "QueueInsights" ADD CONSTRAINT "QueueInsights_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
