import type { Request, Response } from "express";

import type { ApiKeyCreateRequestType } from "@models/api-key/requests/ApiKeyCreateRequest";
import type { ApiKeySearchRequest } from "@models/api-key/requests/ApiKeySearchRequest";

import apiKeyService from "@services/api-key/apiKey.service";

import { createToken, hashToken } from "@utils/crypto.util";
import { handleError } from "@utils/error.util";

const create = async (req: Request, res: Response) => {
	try {
		const requestBody = req.body as ApiKeyCreateRequestType;

		const secret = createToken();
		const hashedSecret = hashToken(secret);

		const result = await apiKeyService.createApiKey(req.db, {
			secret: hashedSecret,
			description: requestBody.description,
			project: {
				connect: { id: requestBody.project_id },
			},
			environment: {
				connect: { id: requestBody.environment_id },
			},
		});
		return res
			.status(201)
			.json({ data: { ...result, unhashed_key: secret }, success: true });
	} catch (error) {
		return handleError(res, error);
	}
};

const revoke = async (req: Request, res: Response) => {
	try {
		const result = await apiKeyService.updateApiKeyById(
			req.db,
			req.params.id as string,
			{ revoked: true, revoked_at: new Date() },
		);

		const { secret, ...rest } = result;
		return res.status(200).json({ data: rest, success: true });
	} catch (error) {
		return handleError(res, error);
	}
};

const getById = async (req: Request, res: Response) => {
	try {
		const result = await apiKeyService.findApiKeyById(
			req.db,
			req.params.id as string,
		);

		if (!result) {
			return handleError(res, "API key not found", 404);
		}

		const { secret, ...rest } = result;
		return res.status(200).json({ data: rest, success: true });
	} catch (error) {
		return handleError(res, error);
	}
};

const search = async (req: Request, res: Response) => {
	try {
		const { page, limit, ...filters } =
			req.validQuery as ApiKeySearchRequest;

		const result = await apiKeyService.search(
			req.db,
			filters,
			page || 1,
			limit || 10,
		);

		return res.status(200).json({ data: result, success: true });
	} catch (error) {
		return handleError(res, error);
	}
};

export default {
	create,
	revoke,
	getById,
	search,
};
