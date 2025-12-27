-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "project_id" TEXT;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
