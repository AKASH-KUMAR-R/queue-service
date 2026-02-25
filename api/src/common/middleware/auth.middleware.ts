import type { NextFunction, Request, Response } from "express";

import apiKeyService from "@services/api-key/apiKey.service";

import { hashToken } from "@utils/crypto.util";
import { handleError } from "@utils/error.util";
import { prisma } from "@utils/prisma.util";

export const workerAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const apiKey = req.headers["x-api-key"] as string;

		if (!apiKey) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const hashedApiKey = hashToken(apiKey);

		const result = await apiKeyService.findApiKeyBySecret(
			prisma,
			hashedApiKey,
		);

		if (!result || result.revoked) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		req.project = result.project;

		next();
	} catch (err) {
		handleError(res, err, 500);
	}
};
