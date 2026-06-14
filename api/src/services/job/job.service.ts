import {
	type Job,
	JobEventType,
	JobStatus,
	type Prisma,
	PrismaClient,
} from "@db/client";
import {
	incrementCounters,
	isRateLimited,
	recordRateLimitUsage,
	setValue,
} from "@lib/inMemoryStore.lib";

import type { QueueJobsFilters } from "@models/queue/requests/QueueJobsListRequest";
import type { WorkerCompletedFilters } from "@models/worker-status/requests/WorkerCompletedJobsListRequest";

import jobEventsService from "@services/job-events/jobEvents.service";
import queueService from "@services/queue/queue.service";

import { logger } from "@utils/logger.util";
import { PaginationParams, PaginationResults } from "@utils/pagination.util";

import { QueueRateLimitExceeded } from "@errors/QueueRateLimitExceeded";

const setWorkerLastSeen = (workerId: string, queueId: string) => {
	setValue(`worker:lastSeen:${workerId}`, {
		lastSeenAt: Date.now(),
		queueId,
	});
};

const incrementWorkerActiveJobs = (workerId: string, delta: number) => {
	incrementCounters(`worker:activeJobs:${workerId}`, {
		activeJobs: delta,
	});
};

const incrementQueueMetrics = (
	queueId: string,
	deltas: {
		activeJobs?: number;
		failedJobs?: number;
		completedJobs?: number;
	},
) => {
	incrementCounters(`queueMetrics:${queueId}`, deltas);
};

const createJob = async (
	db: PrismaClient,
	data: Prisma.JobCreateInput,
	producerId: string,
) => {
	return await db.$transaction(async (tx) => {
		const newJob = await tx.job.create({
			data: {
				...data,
				producer_id: producerId,
			},
		});

		await jobEventsService.createJobEvent(tx, {
			project_id: newJob.project_id,
			queue_id: newJob.queue_id,
			job_id: newJob.id,
			event_type: JobEventType.JOB_CREATED,
			prev_status: JobStatus.PENDING,
			next_status: JobStatus.PENDING,
			environment_id: newJob.environment_id,
		});

		return newJob;
	});
};

const findById = async (db: PrismaClient, id: string) => {
	return await db.job.findUnique({
		where: {
			id,
		},
	});
};

const findJobsByWorkerId = async (
	db: PrismaClient,
	workerId: string,
	page: number,
	limit: number,
	query: WorkerCompletedFilters,
) => {
	const paginationParams = new PaginationParams(page, limit);

	const whereFilters: Prisma.JobWhereInput = {
		...(query.is_scheduled !== undefined && {
			scheduled_at: query.is_scheduled
				? {
						not: null,
					}
				: null,
		}),
	};

	const results = await db.job.findMany({
		where: {
			...whereFilters,
			job_events: {
				some: {
					worker_id: workerId,
					event_type: JobEventType.JOB_COMPLETED,
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
		skip: paginationParams.offset,
		take: paginationParams.limit,
	});

	const total = await db.job.count({
		where: {
			...whereFilters,
			job_events: {
				some: {
					worker_id: workerId,
					event_type: JobEventType.JOB_COMPLETED,
				},
			},
		},
	});

	return new PaginationResults(results, page, limit, total);
};

const findJobsByQueueId = async (
	db: PrismaClient,
	queueId: string,
	page: number,
	limit: number,
	filters: QueueJobsFilters,
) => {
	const paginationParams = new PaginationParams(page, limit);

	const whereFilters: Prisma.JobWhereInput = {
		...(filters.status && { status: filters.status }),
		...(filters.is_scheduled !== undefined && {
			scheduled_at: filters.is_scheduled
				? {
						not: null,
					}
				: null,
		}),
	};
	console.log("Where filters: ", whereFilters);
	const results = await db.job.findMany({
		where: {
			...whereFilters,
			queue_id: queueId,
		},
		orderBy: {
			created_at: "desc",
		},
		take: paginationParams.limit,
		skip: paginationParams.offset,
	});

	const count = await db.job.count({
		where: {
			...whereFilters,
			queue_id: queueId,
		},
	});

	return new PaginationResults(results, page, limit, count);
};

// TODO: Optimize by reducing repeated calls of queue from controller and here
const findNextJob = async (
	db: PrismaClient,
	queue_id: string,
	worker_id: string,
) => {
	let rateLimitCount: number | null = null;
	let rateLimitWindowMs: number | null = null;

	const queue = await queueService.findById(db, queue_id);

	if (!queue) {
		throw new Error("Queue not found");
	}

	rateLimitCount = queue.rate_limit_count;
	rateLimitWindowMs = queue.rate_limit_window_ms;

	if (
		rateLimitCount &&
		rateLimitWindowMs &&
		isRateLimited(
			`ratelimit:${queue_id}`,
			rateLimitCount,
			rateLimitWindowMs,
		)
	) {
		throw new QueueRateLimitExceeded(
			"Queue rate limit exceeded. Please try again later.",
		);
	}

	const acquiredJob = await db.$transaction(async (tx) => {
		const jobSearchTime = new Date();

		const job: Job[] = await tx.$queryRaw`
			UPDATE "Job"
			SET status = ${JobStatus.IN_PROGRESS}::"JobStatus",
				attempts = attempts + 1,
				started_at = (NOW() AT TIME ZONE 'UTC'),
				heartbeated_at = (NOW() AT TIME ZONE 'UTC')
			WHERE id = (
				SELECT id FROM "Job"
				WHERE queue_id = ${queue_id} AND status = ${JobStatus.PENDING}::"JobStatus" AND attempts < 5 AND (scheduled_at IS NULL OR scheduled_at <= NOW())
				ORDER BY "priority" ASC, "created_at" ASC
				FOR UPDATE SKIP LOCKED
				LIMIT 1
			)
			RETURNING *;
		`;

		logger.info(
			`Job Search Time Taken(${queue_id}): ${
				new Date().getTime() - jobSearchTime.getTime()
			} ms`,
		);

		if (!job[0]) {
			return null;
		}

		await jobEventsService.createJobEvent(tx, {
			project_id: queue.project_id,
			queue_id: job[0].queue_id,
			job_id: job[0].id,
			worker_id,
			event_type: JobEventType.JOB_ACQUIRED,
			prev_status: JobStatus.PENDING,
			next_status: JobStatus.IN_PROGRESS,
			environment_id: queue.environment_id,
		});

		return job[0];
	});

	if (acquiredJob) {
		if (rateLimitCount && rateLimitWindowMs) {
			recordRateLimitUsage(
				`ratelimit:${acquiredJob.queue_id}`,
				rateLimitWindowMs,
			);
		}

		setWorkerLastSeen(worker_id, acquiredJob.queue_id);
		incrementWorkerActiveJobs(worker_id, 1);
		incrementQueueMetrics(acquiredJob.queue_id, {
			activeJobs: 1,
		});
	}

	return acquiredJob;
};

const updateHeartbeat = async (
	db: PrismaClient,
	id: string,
	worker_id: string,
) => {
	const updatedJob = await db.$transaction(async (tx) => {
		const updatedJob = await tx.job.update({
			where: {
				id,
			},
			data: {
				heartbeated_at: new Date(),
			},
		});

		if (!updatedJob) {
			throw new Error("Job not found");
		}

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_HEARTBEAT,
			prev_status: updatedJob.status,
			next_status: updatedJob.status,
			environment_id: updatedJob.environment_id,
		});

		return updatedJob;
	});

	setWorkerLastSeen(worker_id, updatedJob.queue_id);

	return updatedJob;
};

const updateById = async (
	db: PrismaClient,
	id: string,
	updatedData: Prisma.JobUpdateInput,
) => {
	return await db.job.update({
		where: {
			id,
		},
		data: updatedData,
	});
};

const updateStatusAsCompleted = async (
	db: PrismaClient,
	id: string,
	worker_id: string,
) => {
	const updatedJob = await db.$transaction(async (tx) => {
		const updatedJob = await tx.job.update({
			where: {
				id,
			},
			data: {
				status: JobStatus.COMPLETED,
			},
		});

		if (!updatedJob) {
			throw new Error("Job not found");
		}

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_COMPLETED,
			prev_status: JobStatus.IN_PROGRESS,
			next_status: JobStatus.COMPLETED,
			environment_id: updatedJob.environment_id,
		});

		return updatedJob;
	});

	setWorkerLastSeen(worker_id, updatedJob.queue_id);
	incrementWorkerActiveJobs(worker_id, -1);
	incrementQueueMetrics(updatedJob.queue_id, {
		activeJobs: -1,
		completedJobs: 1,
	});

	return updatedJob;
};

const updateStatusAsFailed = async (
	db: PrismaClient,
	id: string,
	worker_id: string,
) => {
	const updatedJob = await db.$transaction(async (tx) => {
		const updatedJob = await tx.job.update({
			where: {
				id,
			},
			data: {
				status: JobStatus.FAILED,
			},
		});

		if (!updatedJob) {
			throw new Error("Job not found");
		}

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_FAILED,
			prev_status: JobStatus.IN_PROGRESS,
			next_status: JobStatus.FAILED,
			environment_id: updatedJob.environment_id,
		});

		return updatedJob;
	});

	setWorkerLastSeen(worker_id, updatedJob.queue_id);
	incrementWorkerActiveJobs(worker_id, -1);
	incrementQueueMetrics(updatedJob.queue_id, {
		activeJobs: -1,
		failedJobs: 1,
	});

	return updatedJob;
};

const updateStatusAsPendingByRetry = async (
	db: PrismaClient,
	id: string,
	worker_id: string,
) => {
	return await db.$transaction(async (tx) => {
		const updatedJob = await tx.job.update({
			where: {
				id,
			},
			data: {
				status: JobStatus.PENDING,
			},
		});

		if (!updatedJob) {
			throw new Error("Job not found");
		}

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_REQUEUED,
			prev_status: JobStatus.IN_PROGRESS,
			next_status: JobStatus.PENDING,
			environment_id: updatedJob.environment_id,
		});

		return updatedJob;
	});
};

export default {
	createJob,
	findById,
	findJobsByWorkerId,
	findJobsByQueueId,
	findNextJob,
	updateById,
	updateStatusAsCompleted,
	updateStatusAsFailed,
	updateStatusAsPendingByRetry,
	updateHeartbeat,
};
