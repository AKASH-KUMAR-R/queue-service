import type { Job, RawApiResponseJob } from "../types/types";

export const toJob = (data: RawApiResponseJob): Job => {
	return {
		id: data.id,
		projectId: data.project_id,
		queueId: data.queue_id,
		payload: data.payload,
		status: data.status,
		attempts: data.attempts,
		priority: data.priority,
		timeoutMs: data.timeout_ms,
		heartbeatAt: data.heartbeat_at,
		scheduledAt: data.scheduled_at,
		startedAt: data.started_at,
		updatedAt: data.updated_at,
		createdAt: data.created_at,
	};
};

export const toJobList = (data: RawApiResponseJob[]): Job[] => {
	return data.map((job) => toJob(job));
};
