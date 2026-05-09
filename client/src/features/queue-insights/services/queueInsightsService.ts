import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";

import type {
	GetQueueInsightsResponse,
	RawQueueInsightsParams,
} from "@entities/queue-insights/types/apiTypes";
import type { QueueInsights } from "@entities/queue-insights/types/types";
import { toQueueInsightsList } from "@entities/queue-insights/utils/transform";

export const fetchQueueInsights = async (
	params: RawQueueInsightsParams,
): Promise<QueueInsights[]> => {
	const queryParams = generateQueryParams({
		from: params.from,
		to: params.to,
	});

	const response = await api.get<GetQueueInsightsResponse>(
		`/api/dashboard/queue/${params.queue_id}/insights?${queryParams.toString()}`,
	);

	return toQueueInsightsList(response.data);
};
