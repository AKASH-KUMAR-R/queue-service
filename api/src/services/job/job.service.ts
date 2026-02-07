import {
	type Job,
	JobEventType,
	JobStatus,
	type Prisma,
	PrismaClient,
} from "@prisma/client";

import jobEventsService from "@services/job-events/jobEvents.service";
import queueRateLimiterService from "@services/queue-limit/queueRateLimiter.service";
import queueMetricsService from "@services/queue-metrics/queueMetrics.service";
import queueService from "@services/queue/queue.service";
import workerStatusService from "@services/worker-status/workerStatus.service";

import { PaginationParams, PaginationResults } from "@utils/pagination.util";

import { QueueRateLimitExceeded } from "@errors/QueueRateLimitExceeded";

const createJob = async (
	db: PrismaClient,
	data: Prisma.JobCreateInput,
	worker_id: string,
) => {
	return await db.$transaction(async (tx) => {
		const newJob = await tx.job.create({
			data,
		});

		await workerStatusService.upsertForHeartbeat(tx, worker_id, {
			queue_id: newJob.queue_id,
		});

		await jobEventsService.createJobEvent(tx, {
			project_id: newJob.project_id,
			queue_id: newJob.queue_id,
			job_id: newJob.id,
			worker_id,
			event_type: JobEventType.JOB_CREATED,
			prev_status: JobStatus.PENDING,
			next_status: JobStatus.PENDING,
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
) => {
	const paginationParams = new PaginationParams(page, limit);

	const results = await db.job.findMany({
		where: {
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
) => {
	const paginationParams = new PaginationParams(page, limit);

	const results = await db.job.findMany({
		where: {
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
	return await db.$transaction(async (tx) => {
		const queue = await queueService.findByIdWithQueueLimiter(tx, queue_id);

		if (!queue) {
			throw new Error("Queue not found");
		}

		if (
			queue.queueRateLimiter &&
			queue.queueRateLimiter.job_count >= queue.rate_limit_count!
		) {
			throw new QueueRateLimitExceeded(
				"Queue rate limit exceeded. Please try again later.",
			);
		}

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

		if (!job[0]) {
			await workerStatusService.upsertForHeartbeat(tx, worker_id, {
				queue_id,
			});
			return null;
		}

		if (queue.queueRateLimiter) {
			await queueRateLimiterService.incQueueRateLimitCounter(
				tx,
				queue.queueRateLimiter.id,
			);
		}

		await queueMetricsService.incActiveMetric(tx, queue.id);

		await workerStatusService.upsertForJobAcquired(tx, worker_id, {
			queue_id: queue.id,
		});

		await jobEventsService.createJobEvent(tx, {
			project_id: queue.project_id,
			queue_id: job[0].queue_id,
			job_id: job[0].id,
			worker_id,
			event_type: JobEventType.JOB_ACQUIRED,
			prev_status: JobStatus.PENDING,
			next_status: JobStatus.IN_PROGRESS,
		});

		return job[0];
	});
};

const updateHeartbeat = async (
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
				heartbeated_at: new Date(),
			},
		});

		if (!updatedJob) {
			throw new Error("Job not found");
		}

		await workerStatusService.upsertForHeartbeat(tx, worker_id, {
			queue_id: updatedJob.queue_id,
		});

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_HEARTBEAT,
			prev_status: updatedJob.status,
			next_status: updatedJob.status,
		});

		return updatedJob;
	});
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
	return await db.$transaction(async (tx) => {
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

		await queueMetricsService.incCompletedMetric(tx, updatedJob.queue_id);

		await workerStatusService.upsertForJobReleased(tx, worker_id, {
			queue_id: updatedJob.queue_id,
		});

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_COMPLETED,
			prev_status: JobStatus.IN_PROGRESS,
			next_status: JobStatus.COMPLETED,
		});

		return updatedJob;
	});
};

const updateStatusAsFailed = async (
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
				status: JobStatus.FAILED,
			},
		});

		if (!updatedJob) {
			throw new Error("Job not found");
		}

		await workerStatusService.upsertForJobReleased(tx, worker_id, {
			queue_id: updatedJob.queue_id,
		});

		await queueMetricsService.incFailedMetric(tx, updatedJob.queue_id);

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_FAILED,
			prev_status: JobStatus.IN_PROGRESS,
			next_status: JobStatus.FAILED,
		});

		return updatedJob;
	});
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

		await queueMetricsService.decActiveMetric(tx, updatedJob.queue_id);

		await workerStatusService.upsertForJobReleased(tx, worker_id, {
			queue_id: updatedJob.queue_id,
		});

		await jobEventsService.createJobEvent(tx, {
			project_id: updatedJob.project_id,
			queue_id: updatedJob.queue_id,
			job_id: updatedJob.id,
			worker_id,
			event_type: JobEventType.JOB_REQUEUED,
			prev_status: JobStatus.IN_PROGRESS,
			next_status: JobStatus.PENDING,
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
