import { useQuery } from "@tanstack/react-query";

import { getProjectSummary } from "../services/projectInsightServices";
import { projectInsightsKeys } from "./keys";

export const useProjectInsightsummary = (projectId: string) => {
	return useQuery({
		queryKey: projectInsightsKeys.summary(projectId),
		queryFn: () => getProjectSummary(projectId),
		enabled: !!projectId,
	});
};
