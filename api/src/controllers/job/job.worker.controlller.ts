import type { Request, Response } from "express";

import jobService from "@services/job/job.service";
import { handleError } from "@utils/error.util";

const addJobToQueue = async (req: Request, res: Response) => {
	try {
		const result = await jobService.createJob(req.db, req.body);
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
