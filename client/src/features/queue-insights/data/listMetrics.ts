import { useQuery } from "@tanstack/react-query";

import { SECOND_IN_MILLISECONDS } from "@shared/lib/time";

import type { QueueInsightsParams } from "@entities/queue-insights/types/types";
import { toRawQueueInsightsParams } from "@entities/queue-insights/utils/transform";

import { fetchQueueInsights } from "../services/queueInsightsService";
import { queueInsightsKeys } from "./keys";

export const useQueueInsightsList = (
	projectId: string,
	params: QueueInsightsParams,
	autoRefresh?: boolean,
) => {
	const rawParams = toRawQueueInsightsParams(params);

	return useQuery({
		queryFn: () => fetchQueueInsights(rawParams),
		queryKey: queueInsightsKeys.list({
			...rawParams,
			projectId,
		}),
		// TODO: need to handle this in a better way, currently this is handled via polling, but we can use web sockets to get real time updates. Do socket implementation if we need sockets for other features as well, otherwise we can use polling for now.
		enabled: !!params.queueId && !!projectId,
		refetchInterval: () =>
			autoRefresh ? SECOND_IN_MILLISECONDS * 5 : false,
	});
};
