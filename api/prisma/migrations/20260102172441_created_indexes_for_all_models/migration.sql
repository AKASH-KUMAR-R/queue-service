-- CreateIndex
CREATE INDEX "ApiKey_project_id_revoked_idx" ON "ApiKey"("project_id", "revoked");

-- CreateIndex
CREATE INDEX "Job_queue_id_status_priority_created_at_idx" ON "Job"("queue_id", "status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "JobEvents_job_id_created_at_idx" ON "JobEvents"("job_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Project_user_id_idx" ON "Project"("user_id");

-- CreateIndex
CREATE INDEX "Queue_label_idx" ON "Queue"("label");

-- CreateIndex
CREATE INDEX "Queue_project_id_idx" ON "Queue"("project_id");

-- CreateIndex
CREATE INDEX "QueueMetrics_queue_id_idx" ON "QueueMetrics"("queue_id");

-- CreateIndex
CREATE INDEX "QueueRateLimiter_queue_id_idx" ON "QueueRateLimiter"("queue_id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "WorkerStatus_queue_id_last_seen_idx" ON "WorkerStatus"("queue_id", "last_seen" DESC);
