import zod from "zod";

const ProjectCreateRequest = zod
	.object({
		label: zod.string(),
		description: zod.string().optional(),
	})
	.strip();

export { ProjectCreateRequest };

export type ProjectCreateRequestType = zod.infer<typeof ProjectCreateRequest>;
