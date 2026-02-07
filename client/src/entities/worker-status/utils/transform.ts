import type {
	RawWorkerStatus,
	RawWorkerStatusSearchParams,
	WorkerStatus,
	WorkerStatusSearchParams,
} from "../types/types";

export const toWorkerStatus = (raw: RawWorkerStatus): WorkerStatus => ({
	id: raw.id,
	queueId: raw.queue_id,
	workerId: raw.worker_id,
	activeJobs: raw.active_jobs,
	lastSeen: raw.last_seen,
	metadata: raw.metadata,
	createdAt: raw.created_at,
	updatedAt: raw.updated_at,
});

export const toWorkerStatusList = (
	rawList: RawWorkerStatus[],
): WorkerStatus[] => rawList.map(toWorkerStatus);

export const toWorkerSearchParams = (
	data: WorkerStatusSearchParams,
): RawWorkerStatusSearchParams => ({
	queue_id: data.queueId,
	worker_id: data.workerId,
	limit: data.limit,
	page: data.page,
});
