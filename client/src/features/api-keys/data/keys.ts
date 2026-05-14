import type { ApiKeySearchParams } from "@entities/api-key/model/types";

export const apiKeys = {
	all: ["api-keys"],
	projectKeys: (projectId: string, filters: ApiKeySearchParams) => [
		...apiKeys.all,
		"project",
		projectId,
		filters,
	],
};
