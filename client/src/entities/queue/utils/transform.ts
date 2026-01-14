import type {
	QueueCreateSchemaType,
	QueueUpdateSchemaType,
} from "../schema/queueSchema";
import type { CreateQueueData, UpdateQueueData } from "../types/apiTypes";
import type { Queue, RawApiResponseQueue } from "../types/types";

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

export const toQueueList = (data: RawApiResponseQueue[]): Queue[] => {
	return data.map((queue) => toQueue(queue));
};

// API request data transformation functions can be added here as needed

export const toCreateQueueRequest = (
	data: QueueCreateSchemaType,
): CreateQueueData => {
	return {
		label: data.label,
		description: data.description,
		project_id: data.project_id,
		rate_limit_count: data.rate_limit_count,
		rate_limit_window_ms: data.rate_limit_window_ms,
	};
};

export const toUpdateQueueRequest = (
	data: QueueUpdateSchemaType,
): UpdateQueueData => {
	return {
		label: data.label,
		description: data.description,
		project_id: data.project_id,
		rate_limit_count: data.rate_limit_count,
		rate_limit_window_ms: data.rate_limit_window_ms,
	};
};
