import type { RawApiResponseBase } from "@shared/types/types";

export type RawProjectInsights = RawApiResponseBase & {
	id: string;
	project_id: string;
	bucket_hour: string;
	jobs_enqueued: number;
	jobs_completed: number;
	jobs_failed: number;
	success_rate: number;
	failure_rate: number;
	active_workers: number;
	active_queues: number;
};

export type RawProjectInsightsTrendsParams = {
	from: string;
	to: string;
	environment_id?: string;
};

export type ProjectInsightsSummaryResponse = {
	data: RawProjectInsights;
};

export type ProjectInsightsTrendsResponse = {
	data: RawProjectInsights[];
};
