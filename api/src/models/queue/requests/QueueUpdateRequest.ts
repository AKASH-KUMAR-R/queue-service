import { QueueStatus } from "@prisma/client";
import zod from "zod";

const QueueUpdateRequest = zod
	.object({
		label: zod.string().optional(),
		description: zod.string().optional(),
		status: zod.enum(QueueStatus).optional(),
	})
	.strip();

export { QueueUpdateRequest };
