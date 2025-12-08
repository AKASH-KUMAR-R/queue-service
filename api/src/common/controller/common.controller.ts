import type { Request, Response } from "express";
import { handleError } from "@utils/error.util";
import commonService from "@common/service/common.service";
import type { ModelName } from "../types/model";

const models: Record<string, ModelName> = {
	// Define your models here, e.g., user: "user", post: "post"
	user: "user",
	project: "project",
	queue: "queue",
	job: "job",
	apiKey: "apiKey",
};

const queryFields: Record<string, string[]> = {
	user: ["id", "name", "email"],
	project: ["id", "title", "description"],
	queue: ["id", "status", "createdAt"],
	job: ["id", "status", "queue_id"],
	apiKey: ["project_id"],
};

export const upsert = async (req: Request, res: Response) => {
	try {
		const modelPath = req.originalUrl.split("/")[3];

		console.debug(
			"Model Path:",
			modelPath,
			"Request Path:",
			req.originalUrl
		);

		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}

		const result = await commonService.create(
			models[modelPath],
			req.db,
			req.body
		);

		res.status(201).json({
			data: result,
		});
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
			req.body
		);
		res.status(200).json({
			data: result,
		});
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
			id
		);
		res.status(200).json({
			data: result,
		});
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
			id
		);
		res.status(200).json({
			data: result,
		});
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
			req.originalUrl
		);
		if (!modelPath || !models[modelPath]) {
			return res.status(400).json({ error: "Invalid model path" });
		}
		const result = await commonService.findAll(models[modelPath], req.db);
		res.status(200).json({
			data: result,
		});
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
			validQueryFields
		);

		res.status(200).json({
			data: result,
		});
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
