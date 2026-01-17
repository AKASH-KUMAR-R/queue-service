import { QueueStatus } from "@prisma/client";
import zod from "zod";

const QueueSearchRequest = zod
	.object({
		label: zod.string().optional(),
		status: zod.enum(QueueStatus).optional(),
		project_id: zod.string().optional(),
		page: zod.coerce.number().optional(),
		limit: zod.coerce.number().optional(),
	})
	.strip();

export { QueueSearchRequest };

export type QueueSearchRequestType = zod.infer<typeof QueueSearchRequest>;
