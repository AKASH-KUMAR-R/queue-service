import zod from "zod";

const JobUpdateRequest = zod
	.object({
		payload: zod.json().optional(),
	})
	.strip();

export default JobUpdateRequest;
