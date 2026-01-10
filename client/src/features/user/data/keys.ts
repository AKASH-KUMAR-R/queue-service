export const userKeys = {
	all: ["user"],

	current: () => [...userKeys.all, "currentUser"],
};
