import type { RawApiResponseBase } from "@shared/types/types";

export type RawQueueMetrics = RawApiResponseBase & {
	id: string;
	queue_id: string;
	bucket_hour: string;
	jobs_completed: number;
	jobs_failed: number;
	jobs_requeued: number;
	success_rate: number;
	failure_rate: number;
	retry_rate: number;
	p50_latency: number | null;
	p95_latency: number | null;
	p99_latency: number | null;
};

export type RawQueueMetricsParams = {
	queue_id: string;
	from: string;
	to: string;
};

export type GetQueueMetricsResponse = RawQueueMetrics[];
