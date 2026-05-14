import { useQuery } from "@tanstack/react-query";

import type { ProjectSearchParams } from "@entities/project/types";

import { fetchProjects } from "../services/projectService";
import { projectKeys } from "./keys";

export const useProjectList = (
	filters: ProjectSearchParams,
	options?: { enabled?: boolean },
) => {
	return useQuery({
		queryFn: () => fetchProjects(filters),
		queryKey: projectKeys.lists(filters),
		enabled: options?.enabled,
	});
};
