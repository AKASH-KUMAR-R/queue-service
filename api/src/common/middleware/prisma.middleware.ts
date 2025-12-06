import type { NextFunction, Request, Response } from "express";
import { handleError } from "../../utils/error.util";
import { PrismaClient } from "@prisma/client";

export const prismaMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		req.db = new PrismaClient();
		next();
	} catch (err) {
		handleError(res, err, 500);
	}
};
