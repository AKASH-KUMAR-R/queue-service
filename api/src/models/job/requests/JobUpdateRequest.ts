import zod from "zod";

const JobUpdateRequest = zod
	.object({
		payload: zod.json().optional(),
		priority: zod.number().min(1).max(10).optional(),
		scheduled_at: zod.iso.datetime().optional(),
	})
	.strip();

export default JobUpdateRequest;
