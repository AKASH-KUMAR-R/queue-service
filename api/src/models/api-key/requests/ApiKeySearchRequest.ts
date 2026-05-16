import zod from "zod";

const ApiKeySearchRequest = zod
	.object({
		project_id: zod.string().optional(),
		environment_id: zod.string().optional(),
		revoked: zod
			.string()
			.transform((val) => val === "true")
			.optional(),
		page: zod.coerce.number().min(1).optional(),
		limit: zod.coerce.number().min(1).max(100).optional(),
	})
	.strip();

export default ApiKeySearchRequest;

export type ApiKeySearchRequest = zod.infer<typeof ApiKeySearchRequest>;
