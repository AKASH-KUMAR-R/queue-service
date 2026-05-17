import type {
	RawProjectInsights,
	RawProjectInsightsTrendsParams,
} from "../types/apiTypes";
import type {
	ProjectInsights,
	ProjectInsightsTrendsParams,
} from "../types/types";

export const toProjectInsights = (raw: RawProjectInsights): ProjectInsights => {
	return {
		id: raw.id,
		projectId: raw.project_id,
		bucketHour: new Date(raw.bucket_hour),
		jobsEnqueued: raw.jobs_enqueued,
		jobsCompleted: raw.jobs_completed,
		jobsFailed: raw.jobs_failed,
		successRate: raw.success_rate,
		failureRate: raw.failure_rate,
		activeWorkers: raw.active_workers,
		activeQueues: raw.active_queues,
		createdAt: raw.created_at,
		updatedAt: raw.updated_at,
	};
};

export const toProjectInsightsList = (
	rawList: RawProjectInsights[],
): ProjectInsights[] => {
	return rawList.map(toProjectInsights);
};

export const toProjectInsightsTrendsRequestParams = (
	params: ProjectInsightsTrendsParams,
): RawProjectInsightsTrendsParams => {
	return {
		from: params.from.toISOString(),
		to: params.to.toISOString(),
		environment_id: params.environmentId,
	};
};

export const toRawProjectInsightsTrendsParams = (
	params: ProjectInsightsTrendsParams,
): RawProjectInsightsTrendsParams => {
	return {
		from: params.from.toISOString(),
		to: params.to.toISOString(),
		environment_id: params.environmentId,
	};
};
