import type { Response } from "express";

import { Prisma } from "@prisma/client";
import { PrismaErrorCode } from "@zenstackhq/runtime";

import { QueueRateLimitExceeded } from "@errors/QueueRateLimitExceeded";

import { logger } from "./logger.util";

export const handleError = (
	res: Response,
	error: unknown,
	statusCode = 500,
) => {
	logger.error(error);

	let status = statusCode;
	let returnErrorMessage = "An unexpected error occurred";

	if (typeof error === "string") {
		status = statusCode;
		returnErrorMessage = error;
	} else if (error instanceof QueueRateLimitExceeded) {
		status = error.statusCode;
		returnErrorMessage = error.message;
	} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_FAILED) {
			returnErrorMessage = "Resource already exists";
			status = 409;
		} else if (
			error.code ===
				PrismaErrorCode.REQUIRED_CONNECTED_RECORD_NOT_FOUND ||
			error.code === PrismaErrorCode.DEPEND_ON_RECORD_NOT_FOUND
		) {
			status = 400;
			returnErrorMessage = "Related resource does not exist";
		} else {
			status = 500;
			returnErrorMessage = "Server database error";
		}
	} else if (error instanceof Error) {
		returnErrorMessage = error.message;
	}

	return res.status(status).json({
		error: returnErrorMessage,
	});
};
