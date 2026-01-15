import type { QueueSearchParams } from "@entities/queue/types/types";

export const queueKeys = {
	all: ["queues"] as const,
	search: (query: QueueSearchParams) =>
		[...queueKeys.all, "search", query] as const,
};
