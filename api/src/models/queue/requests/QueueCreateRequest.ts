import { env } from "process";
import zod from "zod";

const QueueCreateRequest = zod
	.object({
		label: zod.string(),
		description: zod.string().optional(),
		project_id: zod.uuid(),
		environment_id: zod.uuid(),
		rate_limit_count: zod.number().min(1).optional(),
		rate_limit_window_ms: zod.number().min(1).optional(),
	})
	.superRefine((data, ctx) => {
		if (data.rate_limit_count && !data.rate_limit_window_ms) {
			ctx.addIssue({
				code: "custom",
				path: ["rate_limit_window_ms"],
				message: "Rate limit window is required for rate limiter",
			});
		}

		if (data.rate_limit_window_ms && !data.rate_limit_count) {
			ctx.addIssue({
				code: "custom",
				path: ["rate_limit_count"],
				message: "Rate limit count is required for rate limiter",
			});
		}
	})
	.strip();

export { QueueCreateRequest };

export type QueueCreateRequestType = zod.infer<typeof QueueCreateRequest>;
