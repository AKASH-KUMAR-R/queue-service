import { useQuery } from "@tanstack/react-query";

import type { PaginationParams } from "@shared/types/types";

import { list } from "../services/apiKeyService";
import { apiKeys } from "./keys";

export const useApiKeyList = (projectId: string, filters: PaginationParams) => {
	return useQuery({
		queryKey: apiKeys.projectKeys(projectId, filters),
		queryFn: () => list(projectId, filters),
	});
};
