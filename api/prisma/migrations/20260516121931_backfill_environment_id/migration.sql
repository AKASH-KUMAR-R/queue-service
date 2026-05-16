-- This is an empty migration.

UPDATE "ApiKey" as api
SET "environment_id" = env."id"
FROM "Environment" as env
WHERE api."project_id" = env."project_id" AND env."name" = 'development'
  AND api."environment_id" IS NULL;

UPDATE "Queue" as q
SET "environment_id" = env."id"
FROM "Environment" as env
WHERE q."project_id" = env."project_id" AND env."name" = 'development'
  AND q."environment_id" IS NULL;

UPDATE "Job" as j
SET "environment_id" = env."id"
FROM "Environment" as env
WHERE j."project_id" = env."project_id" AND env."name" = 'development'
  AND j."environment_id" IS NULL;

UPDATE "JobEvents" as je
SET "environment_id" = env."id"
FROM "Environment" as env
WHERE je."project_id" = env."project_id" AND env."name" = 'development'
  AND je."environment_id" IS NULL;

UPDATE "QueueInsights" as qi
SET "environment_id" = env."id"
FROM "Environment" as env
WHERE qi."project_id" = env."project_id" AND env."name" = 'development'
  AND qi."environment_id" IS NULL;

UPDATE "ProjectInsights" as pi
SET "environment_id" = env."id"
FROM "Environment" as env   
WHERE pi."project_id" = env."project_id" AND env."name" = 'development'
  AND pi."environment_id" IS NULL;