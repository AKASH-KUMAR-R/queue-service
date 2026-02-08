import { useQuery } from "@tanstack/react-query";

import type { WorkerStatusSearchParams } from "@entities/worker-status/types/types";
import { toWorkerSearchParams } from "@entities/worker-status/utils/transform";

import { searchWorker } from "../services/workerService";
import { queueKeys } from "./keys";

export const useWorkerList = (filters: WorkerStatusSearchParams) => {
	const params = toWorkerSearchParams(filters);

	return useQuery({
		queryKey: queueKeys.searchWorker(params),
		queryFn: () => searchWorker(params),
	});
};
