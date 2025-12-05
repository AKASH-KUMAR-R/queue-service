import type { Response } from "express";

export const handleError = (
	res: Response,
	error: unknown,
	statusCode = 500
) => {
	console.error(error);
	return res.status(statusCode).json({
		error: (error as Error).message || "An unexpected error occurred",
	});
};
