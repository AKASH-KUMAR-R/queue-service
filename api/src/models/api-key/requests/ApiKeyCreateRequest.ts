import zod from "zod";

const ApiKeyCreateRequest = zod
	.object({
		project_id: zod.uuid(),
		description: zod.string().default(""),
	})
	.strip();

export default ApiKeyCreateRequest;

export type ApiKeyCreateRequestType = zod.infer<typeof ApiKeyCreateRequest>;
