import type { PaginationParams } from "@shared/types/types";

import type { QueueSearchParams } from "@entities/queue/types/types";
import type { RawWorkerStatusSearchParams } from "@entities/worker-status/types/types";

export const queueKeys = {
	all: ["queues"] as const,
	search: (query: QueueSearchParams) =>
		[...queueKeys.all, "search", query] as const,
	searchWorker: (query: RawWorkerStatusSearchParams) =>
		[...queueKeys.all, "searchWorker", query] as const,
	workerDoneJobList: (workerId: string, query: PaginationParams) =>
		[...queueKeys.all, "workerDoneJobList", workerId, query] as const,
};
