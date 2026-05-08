import { useQuery } from "@tanstack/react-query";

import type { QueueMetricsParams } from "@entities/queue-metrics/types/types";
import { toRawQueueMetricsParams } from "@entities/queue-metrics/utils/transform";

import { fetchQueueMetrics } from "../services/queueMetricsService";
import { queueMetricsKeys } from "./keys";

export const useQueueMetricsList = (
	projectId: string,
	params: QueueMetricsParams,
) => {
	const rawParams = toRawQueueMetricsParams(params);

	return useQuery({
		queryFn: () => fetchQueueMetrics(rawParams),
		queryKey: queueMetricsKeys.list({
			...rawParams,
			projectId,
		}),
		enabled: !!params.queueId && !!projectId,
	});
};
