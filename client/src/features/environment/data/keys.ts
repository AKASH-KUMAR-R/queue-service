export const environmentKeys = {
	all: ["environments"] as const,
	list: (projectId: string) =>
		[...environmentKeys.all, "list", projectId] as const,
};
