import api from "@shared/api";
import { generateQueryParams } from "@shared/api/utils/requestUtils";

import type {
	ProjectInsightsSummaryResponse as RawProjectInsightsSummaryResponse,
	ProjectInsightsTrendsResponse as RawProjectInsightsTrendsResponse,
	RawProjectInsightsTrendsParams,
} from "@entities/project-insights/types/apiTypes";
import type { ProjectInsights } from "@entities/project-insights/types/types";
import { toProjectInsights, toProjectInsightsList } from "@entities/project-insights/utils/transform";

export type ProjectInsightsummaryResponse = {
	data: ProjectInsights;
};

export type ProjectInsightsTrendsResponse = {
	data: ProjectInsights[];
};

export const getProjectSummary = async (
	projectId: string,
): Promise<ProjectInsightsummaryResponse> => {
	const response = await api.get<RawProjectInsightsSummaryResponse>(
		`/api/dashboard/project/${projectId}/stats/summary`,
	);

	return {
		data: toProjectInsights(response.data.data),
	};
};

export const getProjectTrends = async (
	projectId: string,
	params: RawProjectInsightsTrendsParams,
): Promise<ProjectInsightsTrendsResponse> => {
	const urlParams = generateQueryParams(params);
	const response = await api.get<RawProjectInsightsTrendsResponse>(
		`/api/dashboard/project/${projectId}/stats/trends?${urlParams.toString()}`,
	);

	return {
		data: toProjectInsightsList(response.data.data),
	};
};

