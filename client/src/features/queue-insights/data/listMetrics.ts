import { useQuery } from "@tanstack/react-query";

import type { QueueInsightsParams } from "@entities/queue-insights/types/types";
import { toRawQueueInsightsParams } from "@entities/queue-insights/utils/transform";

import { fetchQueueInsights } from "../services/queueInsightsService";
import { queueInsightsKeys } from "./keys";

export const useQueueInsightsList = (
	projectId: string,
	params: QueueInsightsParams,
) => {
	const rawParams = toRawQueueInsightsParams(params);

	return useQuery({
		queryFn: () => fetchQueueInsights(rawParams),
		queryKey: queueInsightsKeys.list({
			...rawParams,
			projectId,
		}),
		enabled: !!params.queueId && !!projectId,
	});
};
