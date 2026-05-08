import type {
	GetQueueMetricsResponse,
	RawQueueMetrics,
	RawQueueMetricsParams,
} from "../types/apiTypes";
import type { QueueMetrics, QueueMetricsParams } from "../types/types";

export const toQueueMetrics = (raw: RawQueueMetrics): QueueMetrics => {
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

export const toQueueMetricsList = (
	raw: GetQueueMetricsResponse,
): QueueMetrics[] => {
	return raw.map(toQueueMetrics);
};

export const toRawQueueMetricsParams = (
	params: QueueMetricsParams,
): RawQueueMetricsParams => {
	return {
		queue_id: params.queueId,
		from: params.from.toISOString(),
		to: params.to.toISOString(),
	};
};
