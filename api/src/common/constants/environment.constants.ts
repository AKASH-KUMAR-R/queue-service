const DEFAULT_ENVIRONMENTS = [
	{
		name: "production",
		is_default: false,
	},
	{
		name: "development",
		is_default: true,
	},
] as const;

export { DEFAULT_ENVIRONMENTS };
