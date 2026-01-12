export const apiKeys = {
	all: ["api-keys"],
	projectKeys: (projectId: string) => [...apiKeys.all, "project", projectId],
};
