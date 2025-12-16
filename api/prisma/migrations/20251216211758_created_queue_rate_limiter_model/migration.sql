-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "rate_limit_count" INTEGER,
ADD COLUMN     "rate_limit_window_ms" INTEGER;

-- CreateTable
CREATE TABLE "QueueRateLimiter" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "job_count" INTEGER NOT NULL DEFAULT 0,
    "last_reset_at" TIMESTAMP(3),
    "queue_id" TEXT NOT NULL,

    CONSTRAINT "QueueRateLimiter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QueueRateLimiter_queue_id_key" ON "QueueRateLimiter"("queue_id");

-- AddForeignKey
ALTER TABLE "QueueRateLimiter" ADD CONSTRAINT "QueueRateLimiter_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
