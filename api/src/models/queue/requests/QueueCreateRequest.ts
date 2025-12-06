import zod from "zod";

const QueueCreateRequest = zod
	.object({
		project_id: zod.uuid(),
	})
	.strip();

export { QueueCreateRequest };
