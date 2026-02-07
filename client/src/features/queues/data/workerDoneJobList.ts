import { useQuery } from "@tanstack/react-query";

import type { PaginationParams } from "@shared/types/types";

import { searchJobsDoneByWorker } from "../services/workerService";
import { queueKeys } from "./keys";

export const useWorkerDoneJobList = (
	query: PaginationParams,
	workerId: string | null,
) => {
	return useQuery({
		queryKey: queueKeys.workerDoneJobList(workerId!, query),
		queryFn: () => searchJobsDoneByWorker(workerId!, query),
		enabled: !!workerId,
	});
};
