import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";

import type { JobListResponse } from "@entities/job/types/apiTypes";
import type { RawJobSearchParams } from "@entities/job/types/types";
import { toJobList } from "@entities/job/utils/transform";

export const fetchJobs = async (
	queueId: string,
	filters: RawJobSearchParams,
): Promise<JobListResponse> => {
	const params = generateQueryParams(filters);

	const response = await api.get(
		`/api/dashboard/queue/${queueId}/jobs?${params.toString()}`,
	);

	return {
		data: { ...response.data, results: toJobList(response.data.results) },
	};
};
