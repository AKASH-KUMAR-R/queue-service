import { useQuery } from "@tanstack/react-query";

import { SECOND_IN_MILLISECONDS } from "@shared/lib/time";

import { getProjectSummary } from "../services/projectInsightServices";
import { projectInsightsKeys } from "./keys";

export const useProjectInsightsummary = (
	projectId: string,
	autoRefresh?: boolean,
) => {
	return useQuery({
		queryKey: projectInsightsKeys.summary(projectId),
		queryFn: () => getProjectSummary(projectId),
		enabled: !!projectId,
		refetchInterval: () =>
			autoRefresh ? SECOND_IN_MILLISECONDS * 5 : false,
	});
};
