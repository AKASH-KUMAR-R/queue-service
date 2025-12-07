import type { Response } from "express";
import { logger } from "./logger.util";

export const handleError = (
	res: Response,
	error: unknown,
	statusCode = 500
) => {
	logger.error(error);
	return res.status(statusCode).json({
		error: (error as Error).message || "An unexpected error occurred",
	});
};
