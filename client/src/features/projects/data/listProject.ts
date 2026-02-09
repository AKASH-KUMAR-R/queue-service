import { useQuery } from "@tanstack/react-query";

import type { PaginationParams } from "@shared/types/types";

import { fetchProjects } from "../services/projectService";
import { projectKeys } from "./keys";

export const useProjectList = (filters: PaginationParams) => {
	return useQuery({
		queryFn: () => fetchProjects(filters),
		queryKey: projectKeys.lists(filters),
	});
};
