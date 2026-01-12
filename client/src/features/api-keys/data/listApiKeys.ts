import { useQuery } from "@tanstack/react-query";

import { list } from "../services/apiKeyService";
import { apiKeys } from "./keys";

export const useApiKeyList = (projectId: string) => {
	return useQuery({
		queryKey: apiKeys.projectKeys(projectId),
		queryFn: () => list(projectId),
	});
};
