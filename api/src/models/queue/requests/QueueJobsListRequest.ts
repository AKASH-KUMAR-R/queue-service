import zod from "zod";

const QueueJobsListRequest = zod.object({
	page: zod.number().min(1).default(1),
	limit: zod.number().min(1).max(100).default(10),
});

export { QueueJobsListRequest };
