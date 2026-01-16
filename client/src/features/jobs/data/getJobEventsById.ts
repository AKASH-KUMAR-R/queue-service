import { useQuery } from "@tanstack/react-query";

import type { JobEventSearchParams } from "@entities/job/types/types";

import { fetchJobEventsById } from "../services/jobServices";
import { jobKeys } from "./keys";

export const useJobEventsById = (
	jobId: string | null,
	filters: JobEventSearchParams,
) => {
	return useQuery({
		queryFn: () => fetchJobEventsById(jobId!, filters),
		queryKey: jobKeys.events(jobId!, filters),
		enabled: !!jobId,
	});
};
