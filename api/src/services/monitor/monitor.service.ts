import { JobEventType, JobStatus } from "@db/client";
import { incrementCounters } from "@lib/inMemoryStore.lib";

import jobEventsService from "@services/job-events/jobEvents.service";

import { logger } from "@utils/logger.util";
import { prisma } from "@utils/prisma.util";

const MAX_ATTEMPTS = 5;
const ALLOWED_HEARTBEAT_GAP = 30000;
const SCHEDULER_WORKER_ID = "scheduler:monitor-worker";

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

export const detectAndHandleTimeoutJobs = async () => {
	const timeoutedJobs = await prisma.job.findMany({
		where: {
			status: JobStatus.IN_PROGRESS,
			timeout_ms: {
				gt: 0,
			},
			started_at: {
				not: null,
			},
		},
		orderBy: {
			created_at: "asc",
		},
		take: 100,
	});

	logger.info(`Found ${timeoutedJobs.length} jobs for timeout case`);

	// await checkTimeSynchronization();
	if (!timeoutedJobs.length) {
		return;
	}

	const now = new Date();

	const expiredJobs = timeoutedJobs.filter((eachJob) => {
		if (eachJob.timeout_ms && eachJob.started_at) {
			return (
				now.getTime() - eachJob.started_at.getTime() >
				eachJob.timeout_ms
			);
		}

		return false;
	});

	logger.info(`${expiredJobs.length} jobs expired`);

	for (const job of expiredJobs) {
		if (!job.started_at || !job.timeout_ms) continue;

		const currAttempts = job.attempts;
		const isTerminated = currAttempts + 1 > MAX_ATTEMPTS;

		const updatedJob = await prisma.$transaction(async (tx) => {
			const txUpdatedJob = await tx.job.update({
				where: {
					id: job.id,
					status: JobStatus.IN_PROGRESS,
					attempts: currAttempts,
				},
				data: {
					status: isTerminated ? JobStatus.FAILED : JobStatus.PENDING,
				},
			});

			if (!txUpdatedJob) {
				throw new Error("Job not found");
			}

			await jobEventsService.createJobEvent(tx, {
				project_id: txUpdatedJob.project_id,
				queue_id: txUpdatedJob.queue_id,
				job_id: txUpdatedJob.id,
				environment_id: txUpdatedJob.environment_id,
				worker_id: SCHEDULER_WORKER_ID,
				event_type: isTerminated
					? JobEventType.JOB_FAILED
					: JobEventType.JOB_REQUEUED,
				prev_status: JobStatus.IN_PROGRESS,
				next_status: isTerminated
					? JobStatus.FAILED
					: JobStatus.PENDING,
				metadata: {
					reason: "timeout",
					info: `The job exceeded its timeout of ${job.timeout_ms} ms.`,
				},
			});

			return txUpdatedJob;
		});

		if (updatedJob) {
			if (isTerminated) {
				incrementQueueMetrics(updatedJob.queue_id, {
					activeJobs: -1,
					failedJobs: 1,
				});
			} else {
				incrementQueueMetrics(updatedJob.queue_id, {
					activeJobs: -1,
				});
			}
		}

		logger.info(
			`Job with id ${job.id} is marked as ${isTerminated ? "failed" : "pending"} due to timeout...`,
		);
	}
};

export const detectAndHandleDeadJobs = async () => {
	const deadJobs = await prisma.job.findMany({
		where: {
			status: JobStatus.IN_PROGRESS,
			started_at: {
				not: null,
			},
		},
		orderBy: {
			created_at: "asc",
		},
		take: 100,
	});

	logger.info(`Found ${deadJobs.length} for dead check`);

	if (!deadJobs.length) {
		return;
	}

	const now = new Date();

	const expiredJobs = deadJobs.filter((eachOne) => {
		if (!eachOne.heartbeated_at) return false;

		return (
			now.getTime() - eachOne.heartbeated_at.getTime() >
			ALLOWED_HEARTBEAT_GAP
		);
	});

	logger.info(
		`${expiredJobs.length} jobs are dead due to delay in heartbeat`,
	);

	for (const job of expiredJobs) {
		const currAttempts = job.attempts;
		const isTerminated = currAttempts + 1 > MAX_ATTEMPTS;

		const updatedJob = await prisma.$transaction(async (tx) => {
			const txUpdatedJob = await tx.job.update({
				where: {
					id: job.id,
					status: JobStatus.IN_PROGRESS,
					attempts: currAttempts,
				},
				data: {
					status: isTerminated ? JobStatus.FAILED : JobStatus.PENDING,
				},
			});

			if (!txUpdatedJob) {
				return null;
			}

			await jobEventsService.createJobEvent(tx, {
				project_id: txUpdatedJob.project_id,
				queue_id: txUpdatedJob.queue_id,
				job_id: txUpdatedJob.id,
				environment_id: txUpdatedJob.environment_id,
				worker_id: SCHEDULER_WORKER_ID,
				event_type: isTerminated
					? JobEventType.JOB_FAILED
					: JobEventType.JOB_REQUEUED,
				prev_status: JobStatus.IN_PROGRESS,
				next_status: isTerminated
					? JobStatus.FAILED
					: JobStatus.PENDING,
				metadata: {
					reason: "dead_heartbeat",
					info:
						"The job's heartbeat was not received in time. Last heartbeat at " +
						txUpdatedJob.heartbeated_at?.toISOString(),
				},
			});

			return txUpdatedJob;
		});

		if (updatedJob) {
			if (isTerminated) {
				incrementQueueMetrics(updatedJob.queue_id, {
					activeJobs: -1,
					failedJobs: 1,
				});
			} else {
				incrementQueueMetrics(updatedJob.queue_id, {
					activeJobs: -1,
				});
			}
		}

		logger.info(
			`Job with id ${job.id} is marked as ${isTerminated ? "failed" : "pending"} due to dead heartbeat...`,
		);
	}
};
