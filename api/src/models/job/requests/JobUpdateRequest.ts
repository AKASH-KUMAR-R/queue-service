import zod from "zod";

const JobUpdateRequest = zod.object({
	queue_id: zod.uuid().optional(),
	payload: zod.json().optional(),
});

export default JobUpdateRequest;
