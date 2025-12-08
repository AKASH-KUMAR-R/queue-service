import zod from "zod";

const QueueCreateRequest = zod
	.object({
		label: zod.string(),
		description: zod.string().optional(),
		project_id: zod.uuid(),
	})
	.strip();

export { QueueCreateRequest };
