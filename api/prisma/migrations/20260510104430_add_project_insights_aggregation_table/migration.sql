-- CreateTable
CREATE TABLE "ProjectInsights" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "bucket_hour" TIMESTAMP(3) NOT NULL,
    "jobs_enqueued" INTEGER NOT NULL DEFAULT 0,
    "jobs_completed" INTEGER NOT NULL DEFAULT 0,
    "jobs_failed" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "failure_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active_workers" INTEGER NOT NULL DEFAULT 0,
    "active_queues" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectInsights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectInsights_project_id_bucket_hour_idx" ON "ProjectInsights"("project_id", "bucket_hour");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInsights_project_id_bucket_hour_key" ON "ProjectInsights"("project_id", "bucket_hour");

-- AddForeignKey
ALTER TABLE "ProjectInsights" ADD CONSTRAINT "ProjectInsights_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
