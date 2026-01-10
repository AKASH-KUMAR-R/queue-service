import type { Request, Response } from "express";

import projectService from "@services/project/project.service";

import { handleError } from "@utils/error.util";

const createProject = async (req: Request, res: Response) => {
	try {
		const result = await projectService.create(req.db, {
			...req.body,
			user_id: req.user?.id,
		});

		res.status(201).json({ data: result });
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	createProject,
};
