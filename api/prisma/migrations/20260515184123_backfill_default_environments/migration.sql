-- Backfill default environments for projects that currently have none
WITH projects_without_environment AS (
	SELECT p."id"
	FROM "Project" AS p
	WHERE NOT EXISTS (
		SELECT 1
		FROM "Environment" AS e
		WHERE e."project_id" = p."id"
	)
)
INSERT INTO "Environment" (
	"id",
	"project_id",
	"name",
	"is_default",
	"is_active",
	"created_at",
	"updated_at"
)
SELECT
	gen_random_uuid() AS "id",
	p."id" AS "project_id",
	env."name",
	env."is_default",
	true AS "is_active",
	NOW() AT TIME ZONE 'UTC' AS "created_at",
	NOW() AT TIME ZONE 'UTC' AS "updated_at"
FROM projects_without_environment AS p
CROSS JOIN (
	VALUES
		('production', false),
		('development', true)
) AS env("name", "is_default")
ON CONFLICT ("project_id", "name") DO NOTHING;
