import type {
	QueueCreateSchemaType,
	QueueUpdateSchemaType,
} from "../schema/queueSchema";
import type { CreateQueueData, UpdateQueueData } from "../types/apiTypes";
import type {
	Queue,
	QueueMetrics,
	QueueSearchParams,
	QueueWithMetrics,
	RawApiResponseQueue,
	RawQueueMetrics,
	RawQueueSearchParams,
	RawQueueWithMetrics,
} from "../types/types";

export const toQueue = (data: RawApiResponseQueue): Queue => {
	return {
		id: data.id,
		label: data.label,
		description: data.description,
		projectId: data.project_id,
		rateLimitCount: data.rate_limit_count,
		rateLimitWindowMs: data.rate_limit_window_ms,
		status: data.status,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
};

export const toQueueMetrics = (data: RawQueueMetrics): QueueMetrics => {
	return {
		id: data.id,
		queueId: data.queue_id,
		activeJobs: data.active_jobs,
		failedJobs: data.failed_jobs,
		completedJobs: data.completed_jobs,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
};

export const toQueueWithMetrics = (
	data: RawQueueWithMetrics,
): QueueWithMetrics => {
	return {
		...toQueue(data),
		queueMetrics: data.queue_metrics
			? toQueueMetrics(data.queue_metrics)
			: null,
	};
};

export const toQueueList = (data: RawApiResponseQueue[]): Queue[] => {
	return data.map((queue) => toQueue(queue));
};

export const toQueueWithMetricList = (
	data: RawQueueWithMetrics[],
): QueueWithMetrics[] => {
	return data.map((queue) => toQueueWithMetrics(queue));
};

// API request data transformation functions can be added here as needed

export const toCreateQueueRequest = (
	data: QueueCreateSchemaType,
): CreateQueueData => {
	return {
		label: data.label,
		description: data.description,
		project_id: data.projectId,
		environment_id: data.environmentId,
		rate_limit_count: data.rateLimitCount,
		rate_limit_window_ms: data.rateLimitWindowMs,
	};
};

export const toUpdateQueueRequest = (
	data: Partial<QueueUpdateSchemaType>,
): UpdateQueueData => {
	return {
		label: data.label,
		description: data.description,
		status: data.status,
		rate_limit_count: data.rateLimitCount,
		rate_limit_window_ms: data.rateLimitWindowMs,
	};
};

export const toSearchQueueRequestParams = (
	data: QueueSearchParams,
): RawQueueSearchParams => {
	return {
		label: data.label,
		project_id: data.projectId,
		environment_id: data.environmentId,
		status: data.status,
		page: data.page,
		limit: data.limit,
	};
};
