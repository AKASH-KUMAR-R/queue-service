/*
  Warnings:

  - Made the column `project_id` on table `QueueInsights` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QueueInsights" DROP CONSTRAINT "QueueInsights_project_id_fkey";

-- AlterTable
ALTER TABLE "QueueInsights" ALTER COLUMN "project_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "QueueInsights" ADD CONSTRAINT "QueueInsights_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
