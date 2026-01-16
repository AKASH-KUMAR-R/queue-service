import type {
	Job,
	JobEvent,
	JobSearchParams,
	RawApiResponseJob,
	RawApiResponseJobEvent,
	RawJobSearchParams,
} from "../types/types";

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

export const toSearchJobRequestParams = (
	data: JobSearchParams,
): RawJobSearchParams => {
	return {
		queue_id: data.queueId,
		project_id: data.projectId,
		status: data.status === "ALL" ? undefined : data.status,
		page: data.page,
		limit: data.limit,
	};
};

// Job Event Transformers

export const toJobEvent = (data: RawApiResponseJobEvent): JobEvent => {
	return {
		id: data.id,
		jobId: data.job_id,
		queueId: data.queue_id,
		projectId: data.project_id,
		eventType: data.event_type,
		prevStatus: data.prev_status,
		nextStatus: data.next_status,
		workerId: data.worker_id,
		metadata: data.metadata,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
};

export const toJobEventList = (data: RawApiResponseJobEvent[]): JobEvent[] => {
	return data.map((event) => toJobEvent(event));
};
