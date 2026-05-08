import type { Request, Response } from "express";

import type { QueueInsightsRequestType } from "@models/queue-insights/requests/QueueInsightsRequest";

import queueInsightsService from "@services/queue-insights/queueInsights.service";

import { handleError } from "@utils/error.util";

const getQueueInsights = async (req: Request, res: Response) => {
	try {
		const queueId = req.params.id as string;
		const { from, to } = req.validQuery as QueueInsightsRequestType;

		const insights = await queueInsightsService.getInsights(
			req.db,
			queueId,
			new Date(from),
			new Date(to),
		);

		return res.status(200).json(insights);
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	getQueueInsights,
};
