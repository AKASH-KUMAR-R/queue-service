/*
  Warnings:

  - Made the column `environment_id` on table `ApiKey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `environment_id` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `environment_id` on table `JobEvents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `environment_id` on table `ProjectInsights` required. This step will fail if there are existing NULL values in that column.
  - Made the column `environment_id` on table `Queue` required. This step will fail if there are existing NULL values in that column.
  - Made the column `environment_id` on table `QueueInsights` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_environment_id_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_environment_id_fkey";

-- DropForeignKey
ALTER TABLE "JobEvents" DROP CONSTRAINT "JobEvents_environment_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInsights" DROP CONSTRAINT "ProjectInsights_environment_id_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_environment_id_fkey";

-- DropForeignKey
ALTER TABLE "QueueInsights" DROP CONSTRAINT "QueueInsights_environment_id_fkey";

-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "environment_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "environment_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "JobEvents" ALTER COLUMN "environment_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProjectInsights" ALTER COLUMN "environment_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Queue" ALTER COLUMN "environment_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "QueueInsights" ALTER COLUMN "environment_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvents" ADD CONSTRAINT "JobEvents_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueInsights" ADD CONSTRAINT "QueueInsights_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInsights" ADD CONSTRAINT "ProjectInsights_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
