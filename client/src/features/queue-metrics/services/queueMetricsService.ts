import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";

import type {
	GetQueueMetricsResponse,
	RawQueueMetricsParams,
} from "@entities/queue-metrics/types/apiTypes";
import type { QueueMetrics } from "@entities/queue-metrics/types/types";
import { toQueueMetricsList } from "@entities/queue-metrics/utils/transform";

export const fetchQueueMetrics = async (
	params: RawQueueMetricsParams,
): Promise<QueueMetrics[]> => {
	const queryParams = generateQueryParams({
		from: params.from,
		to: params.to,
	});

	const response = await api.get<GetQueueMetricsResponse>(
		`/api/dashboard/queue/${params.queue_id}/insights?${queryParams.toString()}`,
	);

	return toQueueMetricsList(response.data);
};
