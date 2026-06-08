import cron from "node-cron";

import { runWorkerStatusCron } from "@services/cron.service";

import { logger } from "@utils/logger.util";

const WORKER_STATUS_CRON_SCHEDULE = "*/1 * * * *";

const startWorkerStatusCronJob = () => {
	logger.info(
		`[worker_status_reconciliation] scheduling cron with expression: ${WORKER_STATUS_CRON_SCHEDULE}`,
	);

	cron.schedule(WORKER_STATUS_CRON_SCHEDULE, () => {
		runWorkerStatusCron().catch((err: unknown) => {
			logger.error(
				`[worker_status_reconciliation] scheduled run failed: ${err instanceof Error ? err.message : String(err)}`,
			);
		});
	});
};

export { startWorkerStatusCronJob };
