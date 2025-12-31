
-- Backfill worker_id in JobEvents to 'unknown' where it is NULL

UPDATE "JobEvents" 
SET "worker_id" = 'unknown'
WHERE worker_id IS NULL;
