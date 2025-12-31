import type { Response } from "express";

import { QueueRateLimitExceeded } from "errors/QueueRateLimitExceeded";

import { logger } from "./logger.util";

export const handleError = (
	res: Response,
	error: unknown,
	statusCode = 500,
) => {
	logger.error(error);

	let status = statusCode;

	if (typeof error === "string") {
		status = statusCode;
	} else if (error instanceof QueueRateLimitExceeded) {
		status = error.statusCode;
	}

	const returnErrorMessage =
		typeof error === "string"
			? error
			: error instanceof QueueRateLimitExceeded
				? error.message
				: error instanceof Error
					? error.message
					: "An unexpected error occurred";

	return res.status(status).json({
		error: returnErrorMessage,
	});
};
