import zod from "zod";

const EnvironmentCreateRequest = zod
	.object({
		project_id: zod.uuid(),
		name: zod.string().trim().toLowerCase().min(1).max(100),
		is_default: zod.boolean().optional().default(false),
	})
	.strip();

export { EnvironmentCreateRequest };

export type EnvironmentCreateRequestType = zod.infer<
	typeof EnvironmentCreateRequest
>;
