import type { ApiKeySearchParams } from "@entities/api-key/model/types";

export const apiKeys = {
	all: ["api-keys"],
	projectKeys: (
		projectId: string,
		environmentId: string,
		filters: ApiKeySearchParams,
	) => [...apiKeys.all, "project", projectId, environmentId, filters],
};
