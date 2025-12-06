import { QueueStatus } from "@prisma/client";
import zod from "zod";

const QueueUpdateRequest = zod
	.object({
		status: zod.enum(QueueStatus).optional(),
	})
	.strip();

export { QueueUpdateRequest };
