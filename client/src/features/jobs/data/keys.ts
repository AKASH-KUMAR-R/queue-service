import type {
	JobEventSearchParams,
	RawJobSearchParams,
} from "@entities/job/types/types";

export const jobKeys = {
	all: ["jobs"] as const,
	search: (queueId: string, filters: RawJobSearchParams) =>
		[...jobKeys.all, "search", queueId, filters] as const,
	details: (jobId: string) => [...jobKeys.all, "detail", jobId] as const,
	events: (jobId: string, filters: JobEventSearchParams) =>
		[...jobKeys.all, "events", jobId, filters] as const,
};
