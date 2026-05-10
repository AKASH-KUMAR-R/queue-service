import { Prisma, type PrismaClient, type ProjectInsights } from "@db/client";
import { MINUTES_IN_MILLISECOND } from "lib/time";

import { prisma } from "@utils/prisma.util";

export type AffectedProjectBucket = {
	project_id: string;
	bucket_hour: Date;
};

const ACTIVE_WORKER_WINDOW_MINUTES = 5;
// INFO: The joinig of JobEvents and Queue tables to get affected project buckets. It can be improved by directly maintaining a project_id column in the JobEvents table to avoid the join.We can consider this in future
const getAffectedBuckets = async (
	sinceLastRun: Date,
): Promise<AffectedProjectBucket[]> => {
	return (
		(await prisma.$queryRaw<AffectedProjectBucket[]>(Prisma.sql`
			SELECT DISTINCT
				"Queue"."project_id" AS "project_id",
				date_trunc('hour', "JobEvents"."created_at") AS "bucket_hour"
			FROM "JobEvents"
			INNER JOIN "Queue"
				ON "Queue"."id" = "JobEvents"."queue_id"
			WHERE "JobEvents"."created_at" >= ${sinceLastRun}
			ORDER BY "project_id", "bucket_hour"
		`)) || []
	);
};

const recomputeBucket = async (
	project_id: string,
	bucket_hour: Date,
	now: Date = new Date(),
): Promise<ProjectInsights> => {
	const queueInsightsRows = await prisma.queueInsights.findMany({
		where: {
			bucket_hour,
			queue: {
				project_id,
			},
		},
		select: {
			jobs_enqueued: true,
			jobs_completed: true,
			jobs_failed: true,
		},
	});

	let jobs_enqueued = 0;
	let jobs_completed = 0;
	let jobs_failed = 0;
	let active_queues = 0;

	for (const row of queueInsightsRows) {
		jobs_enqueued += row.jobs_enqueued;
		jobs_completed += row.jobs_completed;
		jobs_failed += row.jobs_failed;

		if (row.jobs_completed + row.jobs_failed > 0) {
			active_queues += 1;
		}
	}

	const active_workers = await prisma.workerStatus.count({
		where: {
			last_seen: {
				gte: new Date(
					now.getTime() -
						ACTIVE_WORKER_WINDOW_MINUTES * MINUTES_IN_MILLISECOND,
				),
			},
			queue: {
				project_id,
			},
		},
	});

	const total = jobs_completed + jobs_failed;
	const success_rate = total === 0 ? 0 : jobs_completed / total;
	const failure_rate = total === 0 ? 0 : jobs_failed / total;

	return await prisma.projectInsights.upsert({
		where: {
			project_id_bucket_hour: {
				project_id,
				bucket_hour,
			},
		},
		update: {
			jobs_enqueued,
			jobs_completed,
			jobs_failed,
			success_rate,
			failure_rate,
			active_workers,
			active_queues,
		},
		create: {
			project_id,
			bucket_hour,
			jobs_enqueued,
			jobs_completed,
			jobs_failed,
			success_rate,
			failure_rate,
			active_workers,
			active_queues,
		},
	});
};

const getProjectSummary = async (
	db: PrismaClient,
	project_id: string,
): Promise<ProjectInsights | null> => {
	return await db.projectInsights.findFirst({
		where: {
			project_id,
		},
		orderBy: {
			bucket_hour: "desc",
		},
	});
};

const getProjectTrends = async (
	db: PrismaClient,
	project_id: string,
	from: Date,
	to: Date,
): Promise<ProjectInsights[]> => {
	return await db.projectInsights.findMany({
		where: {
			project_id,
			bucket_hour: {
				gte: from,
				lte: to,
			},
		},
		orderBy: {
			bucket_hour: "asc",
		},
	});
};

export default {
	getAffectedBuckets,
	recomputeBucket,
	getProjectSummary,
	getProjectTrends,
};
