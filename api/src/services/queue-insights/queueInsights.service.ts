import {
	JobEventType,
	Prisma,
	PrismaClient,
	type QueueInsights,
} from "@db/client";
import { HOUR_IN_MILLISECONDS } from "lib/time";

import { toNullableNumber } from "@utils/parse.util";
import { prisma } from "@utils/prisma.util";

export type AffectedBucket = {
	queue_id: string;
	bucket_hour: Date;
};

type LatencyPercentilesRaw = {
	p50_latency: number | string | null;
	p95_latency: number | string | null;
	p99_latency: number | string | null;
};

// TODO: currently it fetchs all events after the last run time, but we need to add a upper bound as well to avoid fetching too many events in case the cron job fails to run for a long time. We can use the current time as the upper bound.

const getAffectedBuckets = async (
	sinceLastRun: Date,
): Promise<AffectedBucket[]> => {
	return (
		(await prisma.$queryRaw<AffectedBucket[]>(Prisma.sql`
			SELECT DISTINCT
				"queue_id",
				date_trunc('hour', "created_at") AS "bucket_hour"
			FROM "JobEvents"
			WHERE "created_at" >= ${sinceLastRun}
			ORDER BY "queue_id", "bucket_hour"
		`)) || []
	);
};

const recomputeBucket = async (
	queue_id: string,
	bucket_hour: Date,
): Promise<QueueInsights> => {
	const bucketHourEnd = new Date(
		bucket_hour.getTime() + HOUR_IN_MILLISECONDS,
	);

	const events = await prisma.jobEvents.findMany({
		where: {
			queue_id,
			created_at: {
				gte: bucket_hour,
				lt: bucketHourEnd,
			},
			event_type: {
				in: [
					JobEventType.JOB_CREATED,
					JobEventType.JOB_COMPLETED,
					JobEventType.JOB_FAILED,
					JobEventType.JOB_REQUEUED,
				],
			},
		},
		select: {
			event_type: true,
		},
	});

	let jobs_completed = 0;
	let jobs_failed = 0;
	let jobs_requeued = 0;
	let jobs_enqueued = 0;

	for (const event of events) {
		if (event.event_type === JobEventType.JOB_COMPLETED) {
			jobs_completed += 1;
			continue;
		}

		if (event.event_type === JobEventType.JOB_FAILED) {
			jobs_failed += 1;
			continue;
		}

		if (event.event_type === JobEventType.JOB_REQUEUED) {
			jobs_requeued += 1;
			continue;
		}

		if (event.event_type === JobEventType.JOB_CREATED) {
			jobs_enqueued += 1;
		}
	}

	const total = jobs_completed + jobs_failed;
	const success_rate = total === 0 ? 0 : jobs_completed / total;
	const failure_rate = total === 0 ? 0 : jobs_failed / total;
	const retry_rate = total === 0 ? 0 : jobs_requeued / total;

	const [latencyPercentiles] = await prisma.$queryRaw<
		LatencyPercentilesRaw[]
	>(
		Prisma.sql`
				SELECT
					percentile_cont(0.5) WITHIN GROUP (ORDER BY "latency_ms") AS "p50_latency",
					percentile_cont(0.95) WITHIN GROUP (ORDER BY "latency_ms") AS "p95_latency",
					percentile_cont(0.99) WITHIN GROUP (ORDER BY "latency_ms") AS "p99_latency"
				FROM (
					SELECT
						(EXTRACT(EPOCH FROM ("terminal"."created_at" - "created"."created_at")) * 1000)::double precision AS "latency_ms"
					FROM "JobEvents" AS "terminal"
					INNER JOIN "JobEvents" AS "created"
						ON "created"."job_id" = "terminal"."job_id"
						AND "created"."event_type" = ${JobEventType.JOB_CREATED}::"JobEventType"
					WHERE "terminal"."queue_id" = ${queue_id}
						AND "terminal"."created_at" >= ${bucket_hour}
						AND "terminal"."created_at" < ${bucketHourEnd}
						AND "terminal"."event_type" = ${JobEventType.JOB_ACQUIRED}::"JobEventType"
					) AS "latency_rows"
			`,
	);

	return await prisma.queueInsights.upsert({
		where: {
			queue_id_bucket_hour: {
				queue_id,
				bucket_hour,
			},
		},
		update: {
			jobs_enqueued,
			jobs_completed,
			jobs_failed,
			jobs_requeued,
			success_rate,
			failure_rate,
			retry_rate,
			p50_latency: toNullableNumber(latencyPercentiles?.p50_latency),
			p95_latency: toNullableNumber(latencyPercentiles?.p95_latency),
			p99_latency: toNullableNumber(latencyPercentiles?.p99_latency),
		},
		create: {
			queue_id,
			bucket_hour,
			jobs_enqueued,
			jobs_completed,
			jobs_failed,
			jobs_requeued,
			success_rate,
			failure_rate,
			retry_rate,
			p50_latency: toNullableNumber(latencyPercentiles?.p50_latency),
			p95_latency: toNullableNumber(latencyPercentiles?.p95_latency),
			p99_latency: toNullableNumber(latencyPercentiles?.p99_latency),
		},
	});
};

const getInsights = async (
	db: PrismaClient,
	queue_id: string,
	from: Date,
	to: Date,
): Promise<QueueInsights[]> => {
	return await db.queueInsights.findMany({
		where: {
			queue_id,
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
	getInsights,
};
