import zod from "zod";

const WorkerStatusSearchRequest = zod
	.object({
		worker_id: zod.string().optional(),
		queue_id: zod.string().optional(),
		page: zod.coerce.number().optional(),
		limit: zod.coerce.number().optional(),
	})
	.strip();

export type WorkerStatusSearchRequest = zod.infer<
	typeof WorkerStatusSearchRequest
>;

export default WorkerStatusSearchRequest;
