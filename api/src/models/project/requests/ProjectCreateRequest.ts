import zod from "zod";

const ProjectCreateRequest = zod
	.object({
		label: zod.string(),
		description: zod.string().optional(),
	})
	.strip();

export { ProjectCreateRequest };
