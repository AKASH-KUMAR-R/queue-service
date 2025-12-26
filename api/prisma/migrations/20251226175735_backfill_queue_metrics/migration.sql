
-- This migration backfills the QueueMetrics table with aggregated job metrics for each queue.
INSERT INTO "QueueMetrics"
( id, queue_id, active_jobs, failed_jobs, completed_jobs, updated_at)
SELECT 
    gen_random_uuid() AS id,
    q.id AS queue_id, 
    COUNT(*) FILTER (WHERE j.status = 'IN_PROGRESS') AS active_jobs,
    COUNT(*) FILTER (WHERE j.status = 'FAILED') AS failed_jobs,
    COUNT(*) FILTER (WHERE j.status = 'COMPLETED') AS completed_jobs,
    NOW() AT TIME ZONE 'UTC' AS updated_at
FROM "Queue" AS q
LEFT JOIN "Job" AS j ON q.id = j.queue_id
GROUP BY q.id
ON CONFLICT (queue_id)
DO UPDATE SET
    active_jobs = EXCLUDED.active_jobs,
    failed_jobs = EXCLUDED.failed_jobs,
    completed_jobs = EXCLUDED.completed_jobs,
    updated_at = EXCLUDED.updated_at