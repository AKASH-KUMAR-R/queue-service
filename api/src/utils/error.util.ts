import type { Response } from "express";
import { logger } from "./logger.util";

export const handleError = (
	res: Response,
	error: unknown,
	statusCode = 500
) => {
	logger.error(error);

	const returnErrorMessage =
		typeof error === "string"
			? error
			: error instanceof Error
			? error.message
			: "An unexpected error occurred";

	return res.status(statusCode).json({
		error: returnErrorMessage,
	});
};
