import { useQuery } from "@tanstack/react-query";

import type { ProjectInsightsTrendsParams } from "@entities/project-insights/types/types";
import { toProjectInsightsTrendsRequestParams } from "@entities/project-insights/utils/transform";

import { getProjectTrends } from "../services/projectInsightServices";
import { projectInsightsKeys } from "./keys";

export const useProjectInsightsTrends = (
	projectId: string,
	params: ProjectInsightsTrendsParams,
) => {
	const rawParams = toProjectInsightsTrendsRequestParams(params);

	return useQuery({
		queryKey: projectInsightsKeys.trends(projectId, rawParams),
		queryFn: () => getProjectTrends(projectId, rawParams),
		enabled: !!projectId && !!params.from && !!params.to,
	});
};
