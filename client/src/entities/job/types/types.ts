import type { Base, RawApiResponseBase } from "@shared/types/types";

export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type Job = Base & {
	id: string;
	queueId: string;
	projectId: string;
	payload: Record<string, unknown>;
	status: JobStatus;
	attempts: number;
	priority: number;
	timeoutMs: number | null;
	startedAt: string | null;
	scheduledAt: string | null;
	heartbeatAt: string | null;
};

export type RawApiResponseJob = RawApiResponseBase & {
	id: string;
	queue_id: string;
	project_id: string;
	payload: Record<string, unknown>;
	status: JobStatus;
	attempts: number;
	priority: number;
	timeout_ms: number | null;
	started_at: string | null;
	scheduled_at: string | null;
	heartbeat_at: string | null;
};

export type JobSearchParams = {
	queueId?: string;
	projectId?: string;
	status?: JobStatus;
	limit?: number;
	page?: number;
};

export type RawJobSearchParams = {
	queue_id?: string;
	project_id?: string;
	status?: JobStatus;
	limit?: number;
	page?: number;
};
