-- CreateEnum
CREATE TYPE "JobEventType" AS ENUM ('JOB_CREATED', 'JOB_ACQUIRED', 'JOB_STARTED', 'JOB_HEARTBEAT', 'JOB_COMPLETED', 'JOB_FAILED', 'JOB_REQUEUED', 'JOB_EXPIRED');

-- CreateTable
CREATE TABLE "JobEvents" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "queue_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "event_type" "JobEventType" NOT NULL,
    "prev_status" "JobStatus" NOT NULL,
    "next_status" "JobStatus" NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "JobEvents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobEvents" ADD CONSTRAINT "JobEvents_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvents" ADD CONSTRAINT "JobEvents_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvents" ADD CONSTRAINT "JobEvents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
