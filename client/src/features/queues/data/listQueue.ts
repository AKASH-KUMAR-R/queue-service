import { useQuery } from "@tanstack/react-query";

import type { QueueSearchParams } from "@entities/queue/types/types";
import { toSearchQueueRequestParams } from "@entities/queue/utils/transform";

import { search } from "../services/queueService";
import { queueKeys } from "./keys";

export const useQueueList = (filters: QueueSearchParams) => {
	console.log("Fetching queues with params:", filters);

	const params = toSearchQueueRequestParams(filters);

	return useQuery({
		queryFn: () => search(params),
		queryKey: queueKeys.search(params),
	});
};
