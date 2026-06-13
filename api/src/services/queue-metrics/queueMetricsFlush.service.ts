import type { Prisma } from "@db/client";
import { getAllAndClear } from "@lib/inMemoryStore.lib";

import { logger } from "@utils/logger.util";
import { prisma } from "@utils/prisma.util";

const QUEUE_METRICS_PREFIX = "queueMetrics:";

type QueueMetricsSnapshot = {
	activeJobs?: number;
	failedJobs?: number;
	completedJobs?: number;
};

const isQueueMetricsSnapshot = (value: unknown): value is QueueMetricsSnapshot => {
	return (
		typeof value === "object" &&
		value !== null &&
		("activeJobs" in value || "failedJobs" in value || "completedJobs" in value)
	);
};

const extractQueueId = (key: string) => {
	return key.slice(QUEUE_METRICS_PREFIX.length);
};

const getQueueMetricsSnapshots = (): Map<string, QueueMetricsSnapshot> => {
	const snapshots = new Map<string, QueueMetricsSnapshot>();
	const entries = getAllAndClear(QUEUE_METRICS_PREFIX);

	for (const [key, entry] of entries.entries()) {
		if (entry.type !== "counter" || !isQueueMetricsSnapshot(entry.counts)) {
			logger.warn(
				`[queue_metrics_flush] ignoring invalid queue metrics snapshot for key=${key}`,
			);
			continue;
		}

		const queueId = extractQueueId(key);
		snapshots.set(queueId, {
			...(snapshots.get(queueId) ?? {}),
			...entry.counts,
		});
	}

	return snapshots;
};

const flushQueueMetricsSnapshots = async () => {
	const queueMetricsSnapshots = getQueueMetricsSnapshots();

	for (const [queueId, snapshot] of queueMetricsSnapshots.entries()) {
		const existingQueueMetrics = await prisma.queueMetrics.findUnique({
			where: {
				queue_id: queueId,
			},
		});

		if (!existingQueueMetrics) {
			logger.warn(
				`[queue_metrics_flush] skipping queue_id=${queueId} because QueueMetrics row was not found`,
			);
			continue;
		}

		const updateData: Prisma.QueueMetricsUncheckedUpdateInput = {};

		if (snapshot.activeJobs !== undefined) {
			updateData.active_jobs = {
				increment: snapshot.activeJobs,
			};
		}

		if (snapshot.failedJobs !== undefined) {
			updateData.failed_jobs = {
				increment: snapshot.failedJobs,
			};
		}

		if (snapshot.completedJobs !== undefined) {
			updateData.completed_jobs = {
				increment: snapshot.completedJobs,
			};
		}

		await prisma.queueMetrics.update({
			where: {
				queue_id: queueId,
			},
			data: updateData,
		});
	}

	return queueMetricsSnapshots.size;
};

export default {
	flushQueueMetricsSnapshots,
};
