import type { RawQueueInsightsParams } from "@entities/queue-insights/types/apiTypes";

type QueueInsightsKeyParams = RawQueueInsightsParams & {
	projectId: string;
};

export const queueInsightsKeys = {
	all: ["queue-insights"] as const,
	list: (params: QueueInsightsKeyParams) =>
		[...queueInsightsKeys.all, "list", params] as const,
};
