import type { Request, Response } from "express";

import queueService from "@services/queue/queue.service";

import { handleError } from "@utils/error.util";

const addQueue = async (req: Request, res: Response) => {
	try {
		const data = req.body;

		const newQueue = await queueService.createQueue(
			req.db,
			{
				label: data.label,
				description: data.description,
				project_id: data.project_id,
				rate_limit_count: data.rate_limit_count,
				rate_limit_window_ms: data.rate_limit_window_ms,
			},
			data.rate_limit_count ? { job_count: 0 } : undefined,
		);

		res.status(201).json({ queue: newQueue });
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	addQueue,
};
