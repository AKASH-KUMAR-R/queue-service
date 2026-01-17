import zod from "zod";

const ProjectCreateRequest = zod
	.object({
		label: zod.string(),
		description: zod.string().nullable().default(null),
	})
	.strip();

export { ProjectCreateRequest };

export type ProjectCreateRequestType = zod.infer<typeof ProjectCreateRequest>;
