import { Prisma, type PrismaClient, type ProjectInsights } from "@db/client";
import { MINUTES_IN_MILLISECOND } from "lib/time";

import { prisma } from "@utils/prisma.util";
import { generateUtcHourBuckets } from "@utils/time.util";

export type AffectedProjectBucket = {
	project_id: string;
	environment_id: string;
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
				"project_id",
				"environment_id",
				date_trunc('hour', "created_at") AS "bucket_hour"
			FROM "JobEvents"
			WHERE "created_at" >= ${sinceLastRun}
			ORDER BY "project_id", "environment_id", "bucket_hour"
		`)) || []
	);
};

const recomputeBucket = async (
	project_id: string,
	environment_id: string,
	bucket_hour: Date,
	now: Date = new Date(),
): Promise<ProjectInsights> => {
	const queueInsightsRows = await prisma.queueInsights.findMany({
		where: {
			bucket_hour,
			project_id,
			environment_id,
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
	// NOTE: Here, if the cron job runs after one hour off, then we might miss out on some active workers in the affected bucket. We can consider aligning the cron job run with the bucket hour end time to avoid this issue. For now, we are considering the worker active if it has been seen in the last 5 minutes, which should be good enough for our use case.
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
				environment_id,
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
			environment_id,
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
	environment_id: string,
): Promise<ProjectInsights | null> => {
	return await db.projectInsights.findFirst({
		where: {
			project_id,
			environment_id,
		},
		orderBy: {
			bucket_hour: "desc",
		},
	});
};

const getProjectTrends = async (
	db: PrismaClient,
	project_id: string,
	environment_id: string,
	from: Date,
	to: Date,
): Promise<ProjectInsights[]> => {
	const realRows = await db.projectInsights.findMany({
		where: {
			project_id,
			environment_id,
			bucket_hour: {
				gte: from,
				lte: to,
			},
		},
		orderBy: {
			bucket_hour: "asc",
		},
	});

	const insightsByHour = new Map<number, ProjectInsights>();

	for (const row of realRows) {
		insightsByHour.set(new Date(row.bucket_hour).getTime(), row);
	}

	const emptyBucket = (bucket_hour: Date): ProjectInsights => ({
		id: "",
		project_id,
		environment_id: "",
		bucket_hour,
		jobs_enqueued: 0,
		jobs_completed: 0,
		jobs_failed: 0,
		success_rate: 0,
		failure_rate: 0,
		active_workers: 0,
		active_queues: 0,
		created_at: bucket_hour,
		updated_at: bucket_hour,
	});

	return generateUtcHourBuckets(from, to).map(
		(bucket) => insightsByHour.get(bucket.getTime()) ?? emptyBucket(bucket),
	);
};

export default {
	getAffectedBuckets,
	recomputeBucket,
	getProjectSummary,
	getProjectTrends,
};
