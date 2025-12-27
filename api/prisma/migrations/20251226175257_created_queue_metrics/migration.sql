-- CreateTable
CREATE TABLE "QueueMetrics" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "queue_id" TEXT NOT NULL,
    "active_jobs" BIGINT NOT NULL DEFAULT 0,
    "failed_jobs" BIGINT NOT NULL DEFAULT 0,
    "completed_jobs" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "QueueMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QueueMetrics_queue_id_key" ON "QueueMetrics"("queue_id");

-- AddForeignKey
ALTER TABLE "QueueMetrics" ADD CONSTRAINT "QueueMetrics_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
