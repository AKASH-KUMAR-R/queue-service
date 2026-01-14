import type { Queue, RawApiResponseQueue } from "../types";

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
