import { useQuery } from "@tanstack/react-query";

import type { PaginationParams } from "@shared/types/types";

import type { WorkerJobsFilters } from "@entities/job/types/types";
import { toWorkerJobsFilters } from "@entities/job/utils/transform";

import { searchJobsDoneByWorker } from "../services/workerService";
import { queueKeys } from "./keys";

export const useWorkerDoneJobList = (
	query: WorkerJobsFilters,
	workerId: string | null,
) => {
	const rawQuery = toWorkerJobsFilters(query);

	return useQuery({
		queryKey: queueKeys.workerDoneJobList(workerId!, rawQuery),
		queryFn: () => searchJobsDoneByWorker(workerId!, rawQuery),
		enabled: !!workerId,
	});
};
