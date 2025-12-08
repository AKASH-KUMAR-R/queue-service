import zod from "zod";

const JobCreateRequest = zod
	.object({
		queue_label: zod.string(),
		payload: zod.json(),
	})
	.strip();

export default JobCreateRequest;
