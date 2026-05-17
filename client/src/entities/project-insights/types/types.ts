import type { Base } from "@shared/types/types";

export type ProjectInsights = Base & {
	id: string;
	projectId: string;
	bucketHour: Date;
	jobsEnqueued: number;
	jobsCompleted: number;
	jobsFailed: number;
	successRate: number;
	failureRate: number;
	activeWorkers: number;
	activeQueues: number;
};

export type ProjectInsightsTrendsParams = {
	from: Date;
	to: Date;
	environmentId?: string;
};

export type RawProjectInsightsTrendsParams = {
	from: Date;
	to: Date;
	environment_id?: string;
};
