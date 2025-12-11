import { JobStatus } from "@prisma/client";

import { logger } from "@utils/logger.util";
import { prisma } from "@utils/prisma.util";

const MAX_ATTEMPTS = 5;

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
