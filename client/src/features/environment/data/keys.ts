import type { EnvironmentSearchParams } from "@entities/environment/types/types";

export const environmentKeys = {
	all: ["environments"] as const,
	list: (projectId: string, filters?: EnvironmentSearchParams) =>
		[...environmentKeys.all, "list", projectId, filters] as const,
};
