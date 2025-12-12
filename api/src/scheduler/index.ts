import {
	detectAndHandleDeadJobs,
	detectAndHandleTimeoutJobs,
} from "@services/monitor/monitor.service";

import { logger } from "@utils/logger.util";

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
