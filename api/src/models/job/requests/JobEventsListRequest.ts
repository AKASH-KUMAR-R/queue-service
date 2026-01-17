import zod from "zod";

const JobEventsListRequest = zod.object({
	page: zod.coerce.number().min(1).default(1),
	limit: zod.coerce.number().min(1).max(100).default(10),
});

export { JobEventsListRequest };

export type JobEventsListRequestType = zod.infer<typeof JobEventsListRequest>;
