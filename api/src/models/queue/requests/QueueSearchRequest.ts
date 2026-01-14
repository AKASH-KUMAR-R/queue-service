import { QueueStatus } from "@prisma/client";
import zod from "zod";

const QueueSearchRequest = zod
	.object({
		label: zod.string().optional(),
		status: zod.enum(QueueStatus).optional(),
		project_id: zod.string().optional(),
		page: zod.number().optional(),
		limit: zod.number().optional(),
	})
	.strip()
	.transform((data) => {
		const whereClause: Record<string, any> = {};
		if (data.label) {
			whereClause.label = data.label;
		}
		if (data.status) {
			whereClause.status = data.status;
		}
		if (data.project_id) {
			whereClause.project_id = data.project_id;
		}

		if (data.page) whereClause.page = data.page;
		if (data.limit) whereClause.limit = data.limit;

		return whereClause;
	});

export { QueueSearchRequest };
