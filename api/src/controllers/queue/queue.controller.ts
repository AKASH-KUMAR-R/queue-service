import type { Request, Response } from "express";

import type { Queue } from "@prisma/client";

import queueService from "@services/queue/queue.service";

import { handleError } from "@utils/error.util";

export const addQueue = async (req: Request, res: Response) => {
	try {
		const data: Queue = req.body;

		const newQueue = await queueService.createQueue(req.db, data);

		res.status(201).json({ queue: newQueue });
	} catch (err) {
		handleError(res, err);
	}
};
