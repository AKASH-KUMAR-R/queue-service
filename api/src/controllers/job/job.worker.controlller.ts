import type { Request, Response } from "express";

import { JobStatus } from "@prisma/client";

import jobService from "@services/job/job.service";
import queueService from "@services/queue/queue.service";

import { handleError } from "@utils/error.util";

const addJobToQueue = async (req: Request, res: Response) => {
	try {
		const queue = await queueService.findByLabel(
			req.db,
			req.body.queue_label,
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
			project: {
				connect: {
					id: queue.project_id,
				},
			},
			payload: req.body.payload,
			timeout_ms: req.body.timeout_ms,
			priority: req.body.priority,
			scheduled_at: req.body.scheduled_at,
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

const heartBeatCheck = async (req: Request, res: Response) => {
	try {
		const jobId = req.params.id as string;

		const job = await jobService.findById(req.db, jobId);

		if (!job) {
			return handleError(res, "Job not found", 404);
		}

		if (job.status !== JobStatus.IN_PROGRESS) {
			return res.status(409).json({
				jobId: job.id,
				jobStatus: job.status,
				shouldStop: true,
			});
		}

		await jobService.updateHeartbeat(req.db, jobId);

		res.status(200).json({
			data: {
				jobId: job.id,
				jobStatus: job.status,
				shouldStop: false,
			},
		});
	} catch (err) {
		handleError(res, err);
	}
};

const getNextJobFromQueue = async (req: Request, res: Response) => {
	try {
		const queue_label = req.validQuery.queue_label;

		const queue = await queueService.findByLabel(req.db, queue_label);

		if (!queue) {
			return handleError(res, "No queue found", 404);
		}

		const nextJob = await jobService.findNextJob(req.db, queue.id);

		if (!nextJob) {
			return handleError(res, "No job found", 404);
		}

		return res.status(200).json({
			data: nextJob,
		});
	} catch (err) {
		handleError(res, err);
	}
};

const markAsCompleted = async (req: Request, res: Response) => {
	try {
		const updatedJob = await jobService.updateStatusAsCompleted(
			req.db,
			req.params.id as string,
		);

		return res.status(200).json({
			data: updatedJob,
		});
	} catch (err) {
		handleError(res, err);
	}
};

const markAsFailed = async (req: Request, res: Response) => {
	try {
		const jobId = req.params.id as string;

		const job = await jobService.findById(req.db, jobId);

		if (!job) {
			return handleError(res, "Job not found", 404);
		}

		if (job.status === JobStatus.COMPLETED) {
			return handleError(res, "This job is already completed", 400);
		}

		const updatedJob =
			job.attempts >= 5
				? await jobService.updateStatusAsFailed(req.db, jobId)
				: await jobService.updateById(req.db, jobId, {
						status: JobStatus.PENDING,
					});

		return res.status(200).json({
			data: updatedJob,
		});
	} catch (err) {
		handleError(res, err);
	}
};

const updateJobById = async (req: Request, res: Response) => {
	try {
		const updatedJob = await jobService.updateById(
			req.db,
			req.params.id as string,
			req.body,
		);
		res.status(200).json(updatedJob);
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	addJobToQueue,
	getJobById,
	getNextJobFromQueue,
	updateJobById,
	heartBeatCheck,
	markAsCompleted,
	markAsFailed,
};
