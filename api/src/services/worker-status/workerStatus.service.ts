import {
	JobEventType,
	JobStatus,
	Prisma,
	type PrismaClient,
} from "@db/client";

import { prisma } from "@utils/prisma.util";

const MONITOR_WORKER_ID = "scheduler:monitor-worker";

type ActiveJobsCountRow = {
	active_jobs: bigint | number;
};

type AffectedWorkerRow = {
	worker_id: string;
};

const upsert = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		update: Prisma.WorkerStatusUpsertArgs["update"];
		create: Prisma.WorkerStatusUpsertArgs["create"];
	},
) => {
	return await db.workerStatus.upsert({
		create: data.create,
		update: data.update,
		where: {
			worker_id,
		},
	});
};

const findAffectedWorkerIds = async (from: Date, to: Date) => {
	const rows = await prisma.$queryRaw<AffectedWorkerRow[]>(Prisma.sql`
		WITH "direct_workers" AS (
			SELECT DISTINCT "worker_id"
			FROM "JobEvents"
			WHERE "created_at" >= ${from}
				AND "created_at" < ${to}
				AND "worker_id" IS NOT NULL
				AND "worker_id" <> ${MONITOR_WORKER_ID}
		),
		"resolved_monitor_workers" AS (
			SELECT DISTINCT "resolved"."worker_id"
			FROM "JobEvents" AS "monitor"
			JOIN LATERAL (
				SELECT "worker_id"
				FROM "JobEvents"
				WHERE "job_id" = "monitor"."job_id"
					AND "worker_id" IS NOT NULL
					AND "worker_id" <> ${MONITOR_WORKER_ID}
					AND "event_type" IN (
						${JobEventType.JOB_HEARTBEAT}::"JobEventType",
						${JobEventType.JOB_ACQUIRED}::"JobEventType"
					)
				ORDER BY "created_at" DESC
				LIMIT 1
			) AS "resolved" ON TRUE
			WHERE "monitor"."created_at" >= ${from}
				AND "monitor"."created_at" < ${to}
				AND "monitor"."worker_id" = ${MONITOR_WORKER_ID}
				AND "monitor"."event_type" IN (
					${JobEventType.JOB_FAILED}::"JobEventType",
					${JobEventType.JOB_REQUEUED}::"JobEventType"
				)
		)
		SELECT DISTINCT "worker_id"
		FROM (
			SELECT "worker_id" FROM "direct_workers"
			UNION
			SELECT "worker_id" FROM "resolved_monitor_workers"
		) AS "affected_workers"
		ORDER BY "worker_id" ASC
	`);

	return rows.map((row) => row.worker_id);
};

const findLatestWorkerEvent = async (worker_id: string) => {
	return await prisma.jobEvents.findFirst({
		where: {
			worker_id,
		},
		orderBy: {
			created_at: "desc",
		},
		select: {
			queue_id: true,
			created_at: true,
		},
	});
};

const countActiveJobs = async (worker_id: string) => {
	const [row] = await prisma.$queryRaw<ActiveJobsCountRow[]>(Prisma.sql`
		WITH "latest_real_activity" AS (
			SELECT DISTINCT ON ("job_id")
				"job_id",
				"worker_id",
				"created_at"
			FROM "JobEvents"
			WHERE "worker_id" IS NOT NULL
				AND "worker_id" <> ${MONITOR_WORKER_ID}
				AND "event_type" IN (
					${JobEventType.JOB_ACQUIRED}::"JobEventType",
					${JobEventType.JOB_HEARTBEAT}::"JobEventType"
				)
			ORDER BY "job_id", "created_at" DESC
		)
		SELECT COUNT(*)::bigint AS "active_jobs"
		FROM "latest_real_activity"
		INNER JOIN "Job"
			ON "Job"."id" = "latest_real_activity"."job_id"
		WHERE "latest_real_activity"."worker_id" = ${worker_id}
			AND "Job"."status" = ${JobStatus.IN_PROGRESS}::"JobStatus"
	`);

	return BigInt(row?.active_jobs ?? 0);
};

const recomputeWorkerStatus = async (worker_id: string) => {
	const latestWorkerEvent = await findLatestWorkerEvent(worker_id);

	if (!latestWorkerEvent) {
		return null;
	}

	const active_jobs = await countActiveJobs(worker_id);

	return await upsert(prisma, worker_id, {
		create: {
			worker_id,
			queue_id: latestWorkerEvent.queue_id,
			last_seen: latestWorkerEvent.created_at,
			active_jobs,
		},
		update: {
			queue_id: latestWorkerEvent.queue_id,
			last_seen: latestWorkerEvent.created_at,
			active_jobs,
		},
	});
};

const findByQueueId = async (
	db: PrismaClient | Prisma.TransactionClient,
	queueId: string,
) => {
	return await db.workerStatus.findMany({
		where: {
			queue_id: queueId,
		},
		orderBy: {
			last_seen: "desc",
		},
	});
};

const upsertForJobAcquired = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		queue_id: string;
	},
) => {
	const create: Prisma.WorkerStatusUncheckedCreateInput = {
		worker_id,
		queue_id: data.queue_id,
		last_seen: new Date(),
		active_jobs: 1,
	};

	const update: Prisma.WorkerStatusUncheckedUpdateInput = {
		active_jobs: {
			increment: 1,
		},
		last_seen: new Date(),
	};

	return await db.workerStatus.upsert({
		create,
		update,
		where: {
			worker_id,
		},
	});
};

const upsertForJobReleased = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		queue_id: string;
	},
) => {
	const create: Prisma.WorkerStatusUncheckedCreateInput = {
		worker_id,
		queue_id: data.queue_id,
		last_seen: new Date(),
	};

	const update: Prisma.WorkerStatusUncheckedUpdateInput = {
		active_jobs: {
			decrement: 1,
		},
		last_seen: new Date(),
	};

	return await db.workerStatus.upsert({
		create,
		update,
		where: {
			worker_id,
		},
	});
};

const upsertForHeartbeat = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		queue_id: string;
	},
) => {
	return await db.workerStatus.upsert({
		create: {
			queue_id: data.queue_id,
			worker_id,
			last_seen: new Date(),
			active_jobs: 0,
		},
		update: {
			last_seen: new Date(),
		},
		where: {
			worker_id: worker_id,
		},
	});
};

export default {
	upsert,
	countActiveJobs,
	findAffectedWorkerIds,
	findByQueueId,
	findLatestWorkerEvent,
	recomputeWorkerStatus,
	upsertForHeartbeat,
	upsertForJobAcquired,
	upsertForJobReleased,
};
