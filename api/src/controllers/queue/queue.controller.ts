import type { Request, Response } from "express";

import jobService from "@services/job/job.service";
import queueMetricsService from "@services/queue-metrics/queueMetrics.service";
import queueService from "@services/queue/queue.service";
import workerStatusService from "@services/worker-status/workerStatus.service";

import { handleError } from "@utils/error.util";
import { enhancedSerialize } from "@utils/response.util";

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

const searchQueues = async (req: Request, res: Response) => {
	try {
		const query = req.validQuery;

		const results = await queueService.findQueues(
			req.db,
			query,
			parseInt(query.page as string) || 1,
			parseInt(query.limit as string) || 10,
		);

		res.status(200).json(results);
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

const getQueueMetrics = async (req: Request, res: Response) => {
	try {
		const queueId = req.params.id as string;

		const data = await queueMetricsService.findByQueueId(req.db, queueId);

		if (!data) {
			return res.status(404).json({ message: "Queue metrics not found" });
		}

		res.status(200).json({
			data: enhancedSerialize(data),
		});
	} catch (err) {
		handleError(res, err);
	}
};

const getQueueRelatedWorkers = async (req: Request, res: Response) => {
	try {
		const queueId = req.params.id as string;

		const data = await workerStatusService.findByQueueId(req.db, queueId);

		res.status(200).json({
			data: enhancedSerialize(data),
		});
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	addQueue,
	searchQueues,
	getQueueJobs,
	getQueueMetrics,
	getQueueRelatedWorkers,
};
