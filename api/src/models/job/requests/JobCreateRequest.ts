import zod from "zod";

const JobCreateRequest = zod.object({
	queue_id: zod.uuid(),
	payload: zod.json(),
});

export default JobCreateRequest;
