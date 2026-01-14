import type { Base, RawApiResponseBase } from "@shared/types/types";

export type QueueStatus = "ACTIVE" | "PAUSED" | "DELETED";

export type Queue = Base & {
	id: string;
	label: string;
	description?: string;
	projectId: string;

	rateLimitCount?: number;
	rateLimitWindowMs?: number;

	status: QueueStatus;
};

export type QueueMetrics = Base & {
	id: string;
	queueId: string;
	activeJobs: number;
	failedJobs: number;
	completedJobs: number;
};

export type QueueWithMetrics = Queue & {
	queueMetrics: QueueMetrics | null;
};

export type RawQueueWithMetrics = RawApiResponseQueue & {
	queue_metrics: RawQueueMetrics | null;
};

export type RawQueueMetrics = RawApiResponseBase & {
	id: string;
	queue_id: string;
	active_jobs: number;
	failed_jobs: number;
	completed_jobs: number;
};

export type RawApiResponseQueue = RawApiResponseBase & {
	id: string;
	label: string;
	description?: string;
	project_id: string;

	rate_limit_count?: number;
	rate_limit_window_ms?: number;

	status: QueueStatus;
};

export type QueueSearchParams = {
	label?: string;
	projectId?: string;
	status?: QueueStatus;
};

export type RawQueueSearchParams = {
	label?: string;
	project_id?: string;
	status?: QueueStatus;
};
