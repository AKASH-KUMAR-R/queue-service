import type { Request, Response } from "express";

import type { EnvironmentCreateRequestType } from "@models/environment/requests/EnvironmentCreateRequest";
import type {
	EnvironmentFilters,
	EnvironmentSearchRequestType,
} from "@models/environment/requests/EnvironmentSearchRequest";
import type { EnvironmentUpdateData } from "@models/environment/requests/EnvironmentUpdateRequest";

import environmentService from "@services/environment/environment.service";

import { handleError } from "@utils/error.util";

const createEnvironment = async (req: Request, res: Response) => {
	try {
		const data = req.body as EnvironmentCreateRequestType;

		const result = await environmentService.createEnvironment(req.db, data);

		res.status(201).json({ data: result });
	} catch (error) {
		handleError(res, error);
	}
};

const getEnvironmentById = async (req: Request, res: Response) => {
	try {
		const environment = await environmentService.findById(
			req.db,
			req.params.id as string,
		);

		if (!environment) {
			return handleError(res, "Environment not found", 404);
		}

		res.status(200).json({ data: environment });
	} catch (error) {
		handleError(res, error);
	}
};

const searchEnvironments = async (req: Request, res: Response) => {
	try {
		const { page, limit, ...query } =
			req.validQuery as EnvironmentSearchRequestType;

		const result = await environmentService.findEnvironments(
			req.db,
			query as EnvironmentFilters,
			page || 1,
			limit || 10,
		);

		res.status(200).json({ data: result });
	} catch (error) {
		handleError(res, error);
	}
};

const updateEnvironment = async (req: Request, res: Response) => {
	try {
		const result = await environmentService.updateById(
			req.db,
			req.params.id as string,
			req.body as EnvironmentUpdateData,
		);

		res.status(200).json({ data: result });
	} catch (error) {
		handleError(res, error);
	}
};

const setDefaultEnvironment = async (req: Request, res: Response) => {
	try {
		const result = await environmentService.setDefaultById(
			req.db,
			req.params.id as string,
		);

		res.status(200).json({ data: result });
	} catch (error) {
		handleError(res, error);
	}
};

const deleteEnvironment = async (req: Request, res: Response) => {
	try {
		const result = await environmentService.deleteById(
			req.db,
			req.params.id as string,
		);

		res.status(200).json({ data: result });
	} catch (error) {
		handleError(res, error);
	}
};

export default {
	createEnvironment,
	getEnvironmentById,
	searchEnvironments,
	updateEnvironment,
	setDefaultEnvironment,
	deleteEnvironment,
};
