import type { RawProjectInsightsTrendsParams } from "@entities/project-insights/types/apiTypes";

export const projectInsightsKeys = {
	all: ["project-insights"] as const,
	summary: (projectId: string, environmentId?: string) =>
		[
			...projectInsightsKeys.all,
			"summary",
			projectId,
			environmentId,
		] as const,
	trends: (projectId: string, params: RawProjectInsightsTrendsParams) =>
		[...projectInsightsKeys.all, "trends", projectId, params] as const,
};
