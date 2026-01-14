import type { PaginatedResult } from "@shared/types/utils";

import type { Queue, QueueWithMetrics } from "./types";

export type CreateQueueData = {
	label: string;
	description?: string;
	project_id: string;

	rate_limit_count?: number;
	rate_limit_window_ms?: number;
};

export type UpdateQueueData = {
	label: string;
	description?: string;
	project_id: string;

	rate_limit_count?: number;
	rate_limit_window_ms?: number;
};

export type CreateQueueResponse = {
	data: Queue;
};

export type UpdateQueueResponse = {
	data: Queue;
};

export type SearchQueueResponse = {
	data: PaginatedResult<QueueWithMetrics>;
};
