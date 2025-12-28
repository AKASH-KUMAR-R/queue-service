-- AlterTable
ALTER TABLE "JobEvents" ADD COLUMN     "worker_id" TEXT;

-- CreateTable
CREATE TABLE "WorkerStatus" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "queue_id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "active_jobs" BIGINT NOT NULL DEFAULT 0,
    "last_seen" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "WorkerStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerStatus_worker_id_key" ON "WorkerStatus"("worker_id");

-- AddForeignKey
ALTER TABLE "WorkerStatus" ADD CONSTRAINT "WorkerStatus_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
