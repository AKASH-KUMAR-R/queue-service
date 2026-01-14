import zod from "zod";

export const QueueCreateSchema = zod.object({
	label: zod.string().min(3).max(100),
	description: zod.string().max(500).optional(),
	project_id: zod.uuid(),
	rate_limit_count: zod.number().min(1).optional(),
	rate_limit_window_ms: zod.number().min(1000).optional(),
});

export const QueueUpdateSchema = zod.object({
	label: zod.string().min(3).max(100),
	description: zod.string().max(500).optional(),
	project_id: zod.uuid(),
	rate_limit_count: zod.number().min(1).optional(),
	rate_limit_window_ms: zod.number().min(1000).optional(),
});

export type QueueCreateSchemaType = zod.infer<typeof QueueCreateSchema>;
export type QueueUpdateSchemaType = zod.infer<typeof QueueUpdateSchema>;
