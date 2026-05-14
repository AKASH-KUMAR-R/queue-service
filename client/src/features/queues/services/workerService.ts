import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";
import type { PaginationParams } from "@shared/types/types";

import type { JobListResponse } from "@entities/job/types/apiTypes";
import type { RawWorkerJobsFilters } from "@entities/job/types/types";
import { toJobList } from "@entities/job/utils/transform";
import type {
	RawWorkerStatusSearchParams,
	WorkerStatusListResponse,
} from "@entities/worker-status/types/types";
import { toWorkerStatusList } from "@entities/worker-status/utils/transform";

export const searchWorker = async (
	query: RawWorkerStatusSearchParams,
): Promise<WorkerStatusListResponse> => {
	const queryParams = generateQueryParams(query);

	const response = await api.get(
		`/api/dashboard/worker-status/search?${queryParams.toString()}`,
	);

	return {
		data: {
			...response.data.data,
			results: toWorkerStatusList(response.data.data.results),
		},
	};
};

export const searchJobsDoneByWorker = async (
	workerId: string,
	query: RawWorkerJobsFilters,
): Promise<JobListResponse> => {
	const queryParams = generateQueryParams(query);
	const response = await api.get(
		`/api/dashboard/worker-status/${workerId}/completed-jobs?${queryParams.toString()}`,
	);

	return {
		data: {
			...response.data,
			results: toJobList(response.data.results),
		},
	};
};
