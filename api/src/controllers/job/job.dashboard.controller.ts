import type { Request, Response } from "express";

import jobEventsService from "@services/job-events/jobEvents.service";

import { handleError } from "@utils/error.util";

const getJobEvents = async (req: Request, res: Response) => {
	try {
		const results = await jobEventsService.findByJobId(
			req.db,
			req.params.id as string,
			parseInt(req.query.page as string) || 1,
			parseInt(req.query.limit as string) || 10,
		);

		res.status(200).json(results);
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	getJobEvents,
};
