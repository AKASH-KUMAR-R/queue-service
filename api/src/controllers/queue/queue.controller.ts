import type { Request, Response } from "express";

import jobService from "@services/job/job.service";
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

const getQueueJobs = async (req: Request, res: Response) => {
	try {
		const queueId = req.params.id as string;

		const results = await jobService.findJobsByQueueId(
			req.db,
			queueId,
			parseInt(req.query.page as string) || 1,
			parseInt(req.query.limit as string) || 10,
		);

		res.status(200).json(results);
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	addQueue,
	getQueueJobs,
};
