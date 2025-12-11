import zod from "zod";

const JobCreateRequest = zod
	.object({
		queue_label: zod.string(),
		payload: zod.json(),
		timeout_ms: zod.number().optional(),
	})
	.strip();

export default JobCreateRequest;
