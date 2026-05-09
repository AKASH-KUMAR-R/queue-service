import type { Base } from "@shared/types/types";

export type QueueInsights = Base & {
	id: string;
	queueId: string;
	bucketHour: string;
	jobsCompleted: number;
	jobsFailed: number;
	jobsRequeued: number;
	successRate: number;
	failureRate: number;
	retryRate: number;
	p50Latency: number | null;
	p95Latency: number | null;
	p99Latency: number | null;
};

export type QueueInsightsParams = {
	queueId: string;
	from: Date;
	to: Date;
};
