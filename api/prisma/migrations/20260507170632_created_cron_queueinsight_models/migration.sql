-- CreateTable
CREATE TABLE "QueueInsights" (
    "id" TEXT NOT NULL,
    "queue_id" TEXT NOT NULL,
    "bucket_hour" TIMESTAMP(3) NOT NULL,
    "jobs_completed" INTEGER NOT NULL DEFAULT 0,
    "jobs_failed" INTEGER NOT NULL DEFAULT 0,
    "jobs_requeued" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "failure_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retry_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "p50_latency" DOUBLE PRECISION,
    "p95_latency" DOUBLE PRECISION,
    "p99_latency" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueInsights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CronState" (
    "id" TEXT NOT NULL,
    "cron_name" TEXT NOT NULL,
    "last_run_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QueueInsights_queue_id_bucket_hour_idx" ON "QueueInsights"("queue_id", "bucket_hour");

-- CreateIndex
CREATE UNIQUE INDEX "QueueInsights_queue_id_bucket_hour_key" ON "QueueInsights"("queue_id", "bucket_hour");

-- CreateIndex
CREATE UNIQUE INDEX "CronState_cron_name_key" ON "CronState"("cron_name");

-- CreateIndex
CREATE INDEX "JobEvents_queue_id_created_at_event_type_idx" ON "JobEvents"("queue_id", "created_at", "event_type");

-- AddForeignKey
ALTER TABLE "QueueInsights" ADD CONSTRAINT "QueueInsights_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
