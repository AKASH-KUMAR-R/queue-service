-- project_id backfill migration

UPDATE "Job" AS j 
SET "project_id" = q."project_id"
FROM "Queue" AS q
WHERE j."queue_id" = q."id" AND j."project_id" IS NULL
