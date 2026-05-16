import type { Request, Response } from "express";

import type { ProjectInsightSummaryRequestType } from "@models/project-insights/requests/ProjectInsightSummaryRequest";
import type { ProjectInsightsRequestType } from "@models/project-insights/requests/ProjectInsightsRequest";

import projectInsightsService from "@services/project-insights/projectInsights.service";
import projectService from "@services/project/project.service";

import { handleError } from "@utils/error.util";

const getProjectSummary = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.id as string;
		const { environment_id } =
			req.validQuery as ProjectInsightSummaryRequestType;

		const project = await projectService.getProjectById(req.db, projectId);

		if (!project) {
			return handleError(res, "Project not found", 404);
		}

		const summary = await projectInsightsService.getProjectSummary(
			req.db,
			projectId,
			environment_id,
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
		const { from, to, environment_id } =
			req.validQuery as ProjectInsightsRequestType;

		const project = await projectService.getProjectById(req.db, projectId);

		if (!project) {
			return handleError(res, "Project not found", 404);
		}

		const trends = await projectInsightsService.getProjectTrends(
			req.db,
			projectId,
			environment_id,
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
