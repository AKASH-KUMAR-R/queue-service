import { HOUR_IN_MILLISECONDS } from "lib/time";

import projectInsightsService from "@services/project-insights/projectInsights.service";
import queueInsightsService from "@services/queue-insights/queueInsights.service";

import { logger } from "@utils/logger.util";
import { prisma } from "@utils/prisma.util";

const QUEUE_INSIGHTS_CRON_NAME = "queue_insights";

// TODO: Needs to consider batching and cuncurrency if the affected bucket count is large. For now, we expect the affected bucket count to be small and can be processed within the cron interval.
const runQueueInsightsCron = async (): Promise<void> => {
	try {
		const now = new Date();
		const cronState = await prisma.cronState.findUnique({
			where: {
				cron_name: QUEUE_INSIGHTS_CRON_NAME,
			},
		});

		const lastRunAt =
			cronState?.last_run_at ??
			new Date(now.getTime() - HOUR_IN_MILLISECONDS);

		logger.info(
			`[queue_insights] cron started. using last_run_at=${lastRunAt.toISOString()}`,
		);

		const affectedBuckets =
			await queueInsightsService.getAffectedBuckets(lastRunAt);

		logger.info(
			`[queue_insights] affected bucket count=${affectedBuckets.length}`,
		);

		for (const affectedBucket of affectedBuckets) {
			await queueInsightsService.recomputeBucket(
				affectedBucket.queue_id,
				affectedBucket.bucket_hour,
			);
		}

		const affectedProjectBuckets =
			await projectInsightsService.getAffectedBuckets(lastRunAt);

		logger.info(
			`[project_insights] affected bucket count=${affectedProjectBuckets.length}`,
		);

		for (const affectedBucket of affectedProjectBuckets) {
			await projectInsightsService.recomputeBucket(
				affectedBucket.project_id,
				affectedBucket.bucket_hour,
				now,
			);
		}

		await prisma.cronState.upsert({
			where: {
				cron_name: QUEUE_INSIGHTS_CRON_NAME,
			},
			update: {
				last_run_at: now,
			},
			create: {
				cron_name: QUEUE_INSIGHTS_CRON_NAME,
				last_run_at: now,
			},
		});

		logger.info("[queue_insights] cron completed.");
	} catch (err: unknown) {
		logger.error(
			`[queue_insights] cron error: ${err instanceof Error ? err.message : String(err)}`,
		);
		throw err;
	}
};

export { runQueueInsightsCron };
