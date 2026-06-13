import cron from "node-cron";

import { runQueueMetricsCron } from "@services/cron.service";

import { logger } from "@utils/logger.util";

const QUEUE_METRICS_CRON_SCHEDULE = "*/1 * * * *";

const startQueueMetricsCronJob = () => {
	logger.info(
		`[queue_metrics_flush] scheduling cron with expression: ${QUEUE_METRICS_CRON_SCHEDULE}`,
	);

	cron.schedule(QUEUE_METRICS_CRON_SCHEDULE, () => {
		runQueueMetricsCron().catch((err: unknown) => {
			logger.error(
				`[queue_metrics_flush] scheduled run failed: ${err instanceof Error ? err.message : String(err)}`,
			);
		});
	});
};

export { startQueueMetricsCronJob };
