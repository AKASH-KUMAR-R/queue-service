import type { RawQueueMetricsParams } from "@entities/queue-metrics/types/apiTypes";

type QueueMetricsKeyParams = RawQueueMetricsParams & {
	projectId: string;
};

export const queueMetricsKeys = {
	all: ["queue-metrics"] as const,
	list: (params: QueueMetricsKeyParams) =>
		[...queueMetricsKeys.all, "list", params] as const,
};
