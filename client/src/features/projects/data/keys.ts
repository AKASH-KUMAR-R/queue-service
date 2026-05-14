import type { ProjectSearchParams } from "@entities/project/types";

export const projectKeys = {
	all: ["projects"] as const,
	lists: (filters: ProjectSearchParams) =>
		[...projectKeys.all, "list", filters] as const,
	details: (id: string) => [...projectKeys.all, "detail", id] as const,
};
