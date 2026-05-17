import zod from "zod";

export const QueueCreateSchema = zod.object({
	label: zod.string().min(3).max(100),
	description: zod.string().max(500).optional(),
	projectId: zod.uuid(),
	environmentId: zod.uuid(),
	rateLimitCount: zod.number().min(1).optional(),
	rateLimitWindowMs: zod.number().min(1000).optional(),
});

export const QueueUpdateSchema = zod.object({
	label: zod.string().min(3).max(100),
	description: zod.string().max(500).optional(),
	projectId: zod.uuid(),
	rateLimitCount: zod.number().min(1).optional(),
	rateLimitWindowMs: zod.number().min(1000).optional(),
});

export type QueueCreateSchemaType = zod.infer<typeof QueueCreateSchema>;
export type QueueUpdateSchemaType = zod.infer<typeof QueueUpdateSchema>;
