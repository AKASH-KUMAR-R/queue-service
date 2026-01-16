import { useQuery } from "@tanstack/react-query";

import { fetchJobById } from "../services/jobServices";
import { jobKeys } from "./keys";

export const useJobById = (jobId: string | null) => {
	return useQuery({
		queryFn: () => fetchJobById(jobId!),
		queryKey: jobKeys.details(jobId!),
		enabled: !!jobId,
	});
};
