import type {
	Base,
	PaginationParams,
	RawApiResponseBase,
} from "@shared/types/types";
import type { PaginatedResult } from "@shared/types/utils";

export type WorkerStatus = Base & {
	id: string;
	queueId: string;
	workerId: string;
	activeJobs: number;
	lastSeen: string;
	metadata: Record<string, any>;
};

export type RawWorkerStatus = RawApiResponseBase & {
	id: string;
	queue_id: string;
	worker_id: string;
	active_jobs: number;
	last_seen: string;
	metadata: Record<string, any>;
};

export type WorkerStatusSearchParams = PaginationParams & {
	queueId?: string;
	workerId?: string;
};

export type RawWorkerStatusSearchParams = PaginationParams & {
	queue_id?: string;
	worker_id?: string;
};

// Api Respose types

export type WorkerStatusListResponse = {
	data: PaginatedResult<WorkerStatus>;
};
