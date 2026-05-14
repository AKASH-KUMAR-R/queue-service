import zod from "zod";

const WorkerCompletedListRequest = zod
	.object({
		is_scheduled: zod
			.string()
			.transform((v) => v === "true")
			.optional(),
		page: zod.coerce.number().min(1).optional(),
		limit: zod.coerce.number().min(1).max(100).optional(),
	})
	.strip();

export type WorkerCompletedListRequest = zod.infer<
	typeof WorkerCompletedListRequest
>;

export type WorkerCompletedFilters = {
	is_scheduled?: boolean | undefined;
};

export default WorkerCompletedListRequest;
