import type { Request, Response } from "express";

import type { WorkerCompletedListRequest } from "@models/worker-status/requests/WorkerCompletedJobsListRequest";

import jobService from "@services/job/job.service";

import { handleError } from "@utils/error.util";

const getJobsByWorker = async (req: Request, res: Response) => {
	try {
		const workerId = req.params.id as string;

		const { page, limit, ...validQuery } =
			req.validQuery as WorkerCompletedListRequest;

		const result = await jobService.findJobsByWorkerId(
			req.db,
			workerId,
			page || 1,
			limit || 10,
			validQuery,
		);

		return res.json(result);
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	getJobsByWorker,
};
