import type { PaginationParams } from "@shared/types/types";

export const projectKeys = {
	all: ["projects"] as const,
	lists: (filters: PaginationParams) =>
		[...projectKeys.all, "list", filters] as const,
};
