import zod from "zod";

const EnvironmentUpdateRequest = zod
	.object({
		name: zod.string().trim().toLowerCase().min(1).max(100).optional(),
		is_default: zod.boolean().optional(),
	})
	.strip();

export { EnvironmentUpdateRequest };

export type EnvironmentUpdateRequestType = zod.infer<
	typeof EnvironmentUpdateRequest
>;

export type EnvironmentUpdateData = {
	name?: string;
	is_default?: boolean;
};
