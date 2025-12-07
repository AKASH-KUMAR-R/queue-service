import zod from "zod";

const ApiKeyCreateRequest = zod
	.object({
		project_id: zod.uuid(),
	})
	.strip();

export default ApiKeyCreateRequest;
