import zod from "zod";

const QueueJobsListRequest = zod.object({
	page: zod.coerce.number().min(1).default(1),
	limit: zod.coerce.number().min(1).max(100).default(10),
});

export { QueueJobsListRequest };

export type QueueJobsListRequestType = zod.infer<typeof QueueJobsListRequest>;
