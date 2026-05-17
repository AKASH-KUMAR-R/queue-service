/*
  Warnings:

  - A unique constraint covering the columns `[project_id,environment_id,label]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ApiKey_project_id_revoked_idx";

-- DropIndex
DROP INDEX "ProjectInsights_project_id_bucket_hour_idx";

-- DropIndex
DROP INDEX "Queue_project_id_idx";

-- DropIndex
DROP INDEX "Queue_project_id_label_key";

-- DropIndex
DROP INDEX "QueueInsights_queue_id_bucket_hour_idx";

-- CreateIndex
CREATE INDEX "ApiKey_project_id_environment_id_revoked_idx" ON "ApiKey"("project_id", "environment_id", "revoked");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_project_id_environment_id_label_key" ON "Queue"("project_id", "environment_id", "label");
