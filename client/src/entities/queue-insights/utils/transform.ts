import type {
	GetQueueInsightsResponse,
	RawQueueInsights,
	RawQueueInsightsParams,
} from "../types/apiTypes";
import type { QueueInsights, QueueInsightsParams } from "../types/types";

export const toQueueInsights = (raw: RawQueueInsights): QueueInsights => {
	return {
		id: raw.id,
		queueId: raw.queue_id,
		bucketHour: raw.bucket_hour,
		jobsCompleted: raw.jobs_completed,
		jobsFailed: raw.jobs_failed,
		jobsRequeued: raw.jobs_requeued,
		successRate: raw.success_rate,
		failureRate: raw.failure_rate,
		retryRate: raw.retry_rate,
		p50Latency: raw.p50_latency,
		p95Latency: raw.p95_latency,
		p99Latency: raw.p99_latency,
		createdAt: raw.created_at,
		updatedAt: raw.updated_at,
	};
};

export const toQueueInsightsList = (
	raw: GetQueueInsightsResponse,
): QueueInsights[] => {
	return raw.map(toQueueInsights);
};

export const toRawQueueInsightsParams = (
	params: QueueInsightsParams,
): RawQueueInsightsParams => {
	return {
		queue_id: params.queueId,
		from: params.from.toISOString(),
		to: params.to.toISOString(),
	};
};
