import { useQuery } from "@tanstack/react-query";

import type { ApiKeySearchParams } from "@entities/api-key/model/types";

import { list } from "../services/apiKeyService";
import { apiKeys } from "./keys";

export const useApiKeyList = (
	projectId: string,
	filters: ApiKeySearchParams,
) => {
	return useQuery({
		queryKey: apiKeys.projectKeys(projectId, filters),
		queryFn: () => list(projectId, filters),
	});
};
