import { useQuery } from "@tanstack/react-query";

import { fetchProjectById } from "../services/projectService";
import { projectKeys } from "./keys";

export const useProjectById = (projectId: string | null) => {
	return useQuery({
		queryKey: projectKeys.details(projectId!),
		queryFn: () => fetchProjectById(projectId!),
		enabled: !!projectId,
	});
};
