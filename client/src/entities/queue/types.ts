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

export type RawApiResponseQueue = RawApiResponseBase & {
	id: string;
	label: string;
	description?: string;
	project_id: string;

	rate_limit_count?: number;
	rate_limit_window_ms?: number;

	status: QueueStatus;
};
