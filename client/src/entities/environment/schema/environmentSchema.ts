import { z } from "zod";

const environmentNameSchema = z
	.string()
	.min(1, "Environment name is required")
	.max(100, "Environment name cannot exceed 100 characters")
	.regex(
		/^[a-z0-9-]+$/,
		"Environment name must contain only lowercase letters, numbers, and hyphens",
	)
	.refine(
		(value) => !value.startsWith("-") && !value.endsWith("-"),
		"Environment name cannot start or end with a hyphen",
	);

export const createEnvironmentSchema = z.object({
	projectId: z.string().min(1, "Project is required"),
	name: environmentNameSchema,
	isDefault: z.boolean().optional(),
});

export const updateEnvironmentSchema = z.object({
	name: environmentNameSchema,
	isDefault: z.boolean().optional(),
});

export type CreateEnvironmentFormData = z.infer<typeof createEnvironmentSchema>;

export type UpdateEnvironmentFormData = z.infer<typeof updateEnvironmentSchema>;
