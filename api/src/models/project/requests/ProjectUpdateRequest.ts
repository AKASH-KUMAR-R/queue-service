import zod from "zod";

const ProjectUpdateRequest = zod
	.object({
		label: zod.string().optional(),
		description: zod.string().optional(),
	})
	.strip();

export { ProjectUpdateRequest };
