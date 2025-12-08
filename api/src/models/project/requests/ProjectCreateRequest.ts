import zod from "zod";

const ProjectCreateRequest = zod
	.object({
		label: zod.string().optional(),
		description: zod.string().optional(),
		user_id: zod.uuid(),
	})
	.strip();

export { ProjectCreateRequest };
