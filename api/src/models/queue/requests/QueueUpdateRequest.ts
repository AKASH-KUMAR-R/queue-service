import { QueueStatus } from "@db/client";
import zod from "zod";

const QueueUpdateRequest = zod
	.object({
		label: zod.string().optional(),
		description: zod.string().optional(),
		status: zod.enum(QueueStatus).optional(),
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

export { QueueUpdateRequest };

export type QueueUpdateRequestType = zod.infer<typeof QueueUpdateRequest>;
