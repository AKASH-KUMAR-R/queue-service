import zod from "zod";

const EnvironmentSearchRequest = zod
	.object({
		project_id: zod.string().optional(),
		name: zod.string().toLowerCase().optional(),
		is_default: zod
			.enum(["true", "false"])
			.transform((value) => value === "true")
			.optional(),
		page: zod.coerce.number().min(1).optional(),
		limit: zod.coerce.number().min(1).max(100).optional(),
	})
	.strip();

export { EnvironmentSearchRequest };

export type EnvironmentSearchRequestType = zod.infer<
	typeof EnvironmentSearchRequest
>;

export type EnvironmentFilters = {
	project_id?: string;
	name?: string;
	is_default?: boolean;
};
