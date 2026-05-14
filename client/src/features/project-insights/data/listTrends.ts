import { useQuery } from "@tanstack/react-query";

import { SECOND_IN_MILLISECONDS } from "@shared/lib/time";

import type { ProjectInsightsTrendsParams } from "@entities/project-insights/types/types";
import { toProjectInsightsTrendsRequestParams } from "@entities/project-insights/utils/transform";

import { getProjectTrends } from "../services/projectInsightServices";
import { projectInsightsKeys } from "./keys";

export const useProjectInsightsTrends = (
	projectId: string,
	params: ProjectInsightsTrendsParams,
	autoRefresh?: boolean,
) => {
	const rawParams = toProjectInsightsTrendsRequestParams(params);

	return useQuery({
		queryKey: projectInsightsKeys.trends(projectId, rawParams),
		queryFn: () => getProjectTrends(projectId, rawParams),
		enabled: !!projectId && !!params.from && !!params.to,
		refetchInterval: () =>
			autoRefresh ? SECOND_IN_MILLISECONDS * 5 : false,
	});
};
