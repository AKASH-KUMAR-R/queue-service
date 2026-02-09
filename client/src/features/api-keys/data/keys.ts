import type { PaginationParams } from "@shared/types/types";

export const apiKeys = {
	all: ["api-keys"],
	projectKeys: (projectId: string, filters: PaginationParams) => [
		...apiKeys.all,
		"project",
		projectId,
		filters,
	],
};
