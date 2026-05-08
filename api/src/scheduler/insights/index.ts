import cron from "node-cron";

import { runQueueInsightsCron } from "@services/cron.service";

import { logger } from "@utils/logger.util";

const QUEUE_INSIGHTS_CRON_SCHEDULE = "*/5 * * * *";

const startCronJobs = () => {
	logger.info(
		`[queue_insights] scheduling cron with expression: ${QUEUE_INSIGHTS_CRON_SCHEDULE}`,
	);

	cron.schedule(QUEUE_INSIGHTS_CRON_SCHEDULE, () => {
		runQueueInsightsCron().catch((err: unknown) => {
			logger.error(
				`[queue_insights] scheduled run failed: ${err instanceof Error ? err.message : String(err)}`,
			);
		});
	});
};

export { startCronJobs };
