import type { Request, Response } from "express";

import type { ProjectInsightsRequestType } from "@models/project-insights/requests/ProjectInsightsRequest";

import projectService from "@services/project/project.service";
import projectInsightsService from "@services/project-insights/projectInsights.service";

import { handleError } from "@utils/error.util";

const getProjectSummary = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.id as string;

		const project = await projectService.getProjectById(req.db, projectId);

		if (!project) {
			return handleError(res, "Project not found", 404);
		}

		const summary = await projectInsightsService.getProjectSummary(
			req.db,
			projectId,
		);

		if (!summary) {
			return handleError(res, "Project insights not found", 404);
		}

		return res.status(200).json({ data: summary });
	} catch (err) {
		handleError(res, err);
	}
};

const getProjectTrends = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.id as string;
		const { from, to } = req.validQuery as ProjectInsightsRequestType;

		const project = await projectService.getProjectById(req.db, projectId);

		if (!project) {
			return handleError(res, "Project not found", 404);
		}

		const trends = await projectInsightsService.getProjectTrends(
			req.db,
			projectId,
			new Date(from),
			new Date(to),
		);

		return res.status(200).json({ data: trends });
	} catch (err) {
		handleError(res, err);
	}
};

export default {
	getProjectSummary,
	getProjectTrends,
};
