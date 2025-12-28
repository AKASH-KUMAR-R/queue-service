import {
	detectAndHandleDeadJobs,
	detectAndHandleTimeoutJobs,
} from "@services/monitor/monitor.service";

import { logger } from "@utils/logger.util";

// TODO: timeout and dead job logic mismatch with worker status update logic. Need to align both.
// Eg: when a job is marked as timed out, the worker status should also be updated accordingly and queue metrics.Currently, it is updating only job model.

const startSchedulers = async () => {
	try {
		await detectAndHandleTimeoutJobs();
		await detectAndHandleDeadJobs();
	} catch (err: unknown) {
		logger.error(err instanceof Error ? err.message : err);
	}
};

const main = () => {
	logger.info(`Running detectAndHandleTimeoutJobs for timeoutjobs.....`);
	setInterval(() => {
		startSchedulers();
	}, 3000);
};

main();
