import type { Request, Response } from "express";

import jobService from "@services/job/job.service";
import { handleError } from "@utils/error.util";
import queueService from "@services/queue/queue.service";

const addJobToQueue = async (req: Request, res: Response) => {
	try {
		const queue = await queueService.findByLabel(
			req.db,
			req.body.queue_label
		);
		if (!queue) {
			return handleError(res, "Queue not found", 404);
		}

		const result = await jobService.createJob(req.db, {
			queue: {
				connect: {
					id: queue.id,
				},
			},
			payload: req.body.payload,
		});
		res.status(201).json(result);
	} catch (err) {
		handleError(res, err);
	}
};

const getJobById = async (req: Request, res: Response) => {
	try {
		const job = await jobService.findById(req.db, req.params.id as string);
		if (!job) {
			return handleError(res, "Job not found", 404);
		}

		res.status(200).json(job);
	} catch (err) {
		handleError(res, err);
	}
};

const updateJobById = async (req: Request, res: Response) => {
	try {
		const updatedJob = await jobService.updateById(
			req.db,
			req.params.id as string,
			req.body
		);
		res.status(200).json(updatedJob);
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	addJobToQueue,
	getJobById,
	updateJobById,
};
