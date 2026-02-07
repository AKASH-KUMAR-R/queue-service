import zod from "zod";

const WorkerCompletedListRequest = zod
	.object({
		page: zod.coerce.number().optional(),
		limit: zod.coerce.number().optional(),
	})
	.strip();

export type WorkerCompletedListRequest = zod.infer<
	typeof WorkerCompletedListRequest
>;

export default WorkerCompletedListRequest;
