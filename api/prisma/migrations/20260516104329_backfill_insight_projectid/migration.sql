-- Backfill queue insights with project_id for existing records

UPDATE "QueueInsights" AS qi
SET "project_id" = q."project_id"
FROM "Queue" AS q
WHERE qi."queue_id" = q."id"
AND qi."project_id" IS NULL;
