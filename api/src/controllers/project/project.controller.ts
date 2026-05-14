import type { Request, Response } from "express";

import type { User } from "@db/client";

import type { ProjectCreateRequestType } from "@models/project/requests/ProjectCreateRequest";
import type {
	ProjectFilters,
	ProjectSearchRequestType,
} from "@models/project/requests/ProjectSearchRequest";

import projectService from "@services/project/project.service";

import { handleError } from "@utils/error.util";
import { enhancedSerialize } from "@utils/response.util";

const createProject = async (req: Request, res: Response) => {
	try {
		const result = await projectService.create(req.db, {
			...(req.body as ProjectCreateRequestType),
			user_id: (req.user as User).id,
		});

		res.status(201).json({ data: result });
	} catch (err) {
		handleError(res, err);
	}
};

const searchProjects = async (req: Request, res: Response) => {
	try {
		const { limit, page, ...query } =
			req.validQuery as ProjectSearchRequestType;

		const results = await projectService.findProjects(
			req.db,
			query as ProjectFilters,
			page || 1,
			limit || 10,
		);

		res.status(200).json(enhancedSerialize({ data: results }));
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	createProject,
	searchProjects,
};
