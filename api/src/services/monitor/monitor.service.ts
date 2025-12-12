import { JobStatus } from "@prisma/client";

import { logger } from "@utils/logger.util";
import { prisma } from "@utils/prisma.util";

const MAX_ATTEMPTS = 5;
const ALLOWED_HEARTBEAT_GAP = 30000;

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

		if (currAttempts + 1 > MAX_ATTEMPTS) {
			const result = await prisma.job.updateMany({
				where: {
					id: job.id,
					status: JobStatus.IN_PROGRESS,
					attempts: job.attempts,
				},
				data: {
					status: JobStatus.FAILED,
				},
			});

			if (!result.count) continue;

			logger.info(
				`Job with id ${job.id} is marked ad failed due to timeout...`,
			);
		} else {
			const result = await prisma.job.updateMany({
				where: {
					id: job.id,
					status: JobStatus.IN_PROGRESS,
					attempts: job.attempts,
				},
				data: {
					status: JobStatus.PENDING,
				},
			});

			if (!result.count) continue;

			logger.info(
				`Job with id ${job.id} is marked ad failed due to timeout...`,
			);
		}
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
		const status =
			job.attempts >= MAX_ATTEMPTS ? JobStatus.FAILED : JobStatus.PENDING;

		const result = await prisma.job.updateMany({
			where: {
				id: job.id,
				status: JobStatus.IN_PROGRESS,
				attempts: job.attempts,
				started_at: {
					not: null,
				},
			},
			data: {
				status,
			},
		});

		if (!result.count) {
			continue;
		}

		logger.info(`Job with id ${job.id} is marked as ${status}`);
	}
};
