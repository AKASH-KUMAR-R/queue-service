import * as zod from "zod";

const JobCreateRequest = zod
	.object({
		queue_label: zod.string(),
		payload: zod.json(),
		timeout_ms: zod.number().optional(),
		priority: zod.number().min(1).max(10).default(5),
		scheduled_at: zod.iso.datetime({ offset: true }).optional(),
	})
	.strip();

export default JobCreateRequest;
