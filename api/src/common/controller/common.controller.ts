import type { Request, Response } from "express";

import commonService from "@common/service/common.service";

import { handleError } from "@utils/error.util";
import { enhancedSerialize } from "@utils/response.util";

import type { ModelName } from "../types/model";

const models: Record<string, ModelName> = {
	// Define your models here, e.g., user: "user", post: "post"
	user: "user",
	project: "project",
	queue: "queue",
	job: "job",
	"api-key": "apiKey",
	"job-events": "jobEvents",
	"queue-metrics": "queueMetrics",
	"worker-status": "workerStatus",
};

const queryFields: Record<string, string[]> = {
	user: ["id", "name", "email"],
	project: ["id", "title", "description"],
	queue: ["id", "status", "created_at", "project_id"],
	job: ["id", "status", "queue_id"],
	"api-key": ["project_id"],
	"job-events": [
		"id",
		"job_id",
		"event_type",
		"queue_id",
		"project_id",
		"prev_status",
		"next_status",
	],
	"queue-metrics": ["id", "queue_id"],
	"worker-status": ["queue_id", "worker_id"],
};

const orderBy: Record<string, any> = {
	"worker-status": { last_seen: "desc" },
};

export const upsert = async (req: Request, res: Response) => {
	try {
		const modelPath = req.originalUrl.split("/")[3];

		console.debug(
			"Model Path:",
			modelPath,
			"Request Path:",
			req.originalUrl,
		);

		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}

		const result = await commonService.create(
			models[modelPath],
			req.db,
			req.body,
		);

		res.status(201).json(
			enhancedSerialize({
				data: result,
			}),
		);
	} catch (err) {
		handleError(res, err, 500);
	}
};

export const update = async (req: Request, res: Response) => {
	try {
		const modelPath = req.originalUrl.split("/")[3];

		const id = String(req.params.id);

		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}

		const result = await commonService.updateById(
			models[modelPath],
			req.db,
			id,
			req.body,
		);
		res.status(200).json(
			enhancedSerialize({
				data: result,
			}),
		);
	} catch (err) {
		handleError(res, err, 500);
	}
};

export const remove = async (req: Request, res: Response) => {
	try {
		const modelPath = req.originalUrl.split("/")[3];
		const id = String(req.params.id);

		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}
		const result = await commonService.deleteById(
			models[modelPath],
			req.db,
			id,
		);
		res.status(200).json(
			enhancedSerialize({
				data: result,
			}),
		);
	} catch (err) {
		handleError(res, err, 500);
	}
};

export const getById = async (req: Request, res: Response) => {
	try {
		const modelPath = req.originalUrl.split("/")[3];
		const id = String(req.params.id);

		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}
		const result = await commonService.findById(
			models[modelPath],
			req.db,
			id,
		);
		res.status(200).json(
			enhancedSerialize({
				data: result,
			}),
		);
	} catch (err) {
		handleError(res, err, 500);
	}
};

export const list = async (req: Request, res: Response) => {
	try {
		const modelPath = req.originalUrl.split("/")[3];
		console.debug(
			"Model Path:",
			modelPath,
			"Request Path:",
			req.originalUrl,
		);
		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}
		const result = await commonService.findAll(
			models[modelPath],
			req.db,
			orderBy[modelPath] || null,
		);
		res.status(200).json(
			enhancedSerialize({
				data: result,
			}),
		);
	} catch (err) {
		handleError(res, err, 500);
	}
};

export const search = async (req: Request, res: Response) => {
	try {
		const modelPath = req.originalUrl.split("/")[3];
		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}

		const page = parseInt((req.query.page as string) || "1", 10);
		const limit = parseInt((req.query.limit as string) || "10", 10);

		const query = req.query;
		const validQueryFields: Record<string, any> = {};

		Object.keys(query).forEach((key) => {
			if (
				queryFields[modelPath]?.includes(key) &&
				query[key] !== undefined
			) {
				validQueryFields[key] = query[key];
			}
		});

		const result = await commonService.findMany(
			models[modelPath],
			req.db,
			page,
			limit,
			validQueryFields,
			orderBy[modelPath] || null,
		);

		res.status(200).json(
			enhancedSerialize({
				data: result,
			}),
		);
	} catch (err) {
		handleError(res, err, 500);
	}
};

export default {
	upsert,
	update,
	remove,
	getById,
	list,
	search,
};
