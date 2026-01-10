import { useQuery } from "@tanstack/react-query";

import { fetchProjects } from "../services/projectService";
import { projectKeys } from "./keys";

export const useProjectList = () => {
	return useQuery({
		queryFn: fetchProjects,
		queryKey: projectKeys.lists(),
	});
};
