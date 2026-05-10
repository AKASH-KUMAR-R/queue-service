import type { RawProjectInsightsTrendsParams } from "@entities/project-insights/types/apiTypes";

export const projectInsightsKeys = {
	all: ["project-insights"] as const,
	summary: (projectId: string) =>
		[...projectInsightsKeys.all, "summary", projectId] as const,
	trends: (projectId: string, params: RawProjectInsightsTrendsParams) =>
		[...projectInsightsKeys.all, "trends", projectId, params] as const,
};

