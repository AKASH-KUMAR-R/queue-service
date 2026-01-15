import { useQuery } from "@tanstack/react-query";

import type { JobSearchParams } from "@entities/job/types/types";
import { toSearchJobRequestParams } from "@entities/job/utils/transform";

import { fetchJobs } from "../services/jobServices";
import { jobKeys } from "./keys";

export const useJobsList = (queueId: string, filters: JobSearchParams) => {
	const rawFilters = toSearchJobRequestParams(filters);

	return useQuery({
		queryFn: () => fetchJobs(queueId, rawFilters),
		queryKey: jobKeys.search(queueId, rawFilters),
	});
};
