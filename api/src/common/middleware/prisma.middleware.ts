import type { NextFunction, Request, Response } from "express";
import { handleError } from "../../utils/error.util";
import { prisma } from "../../utils/prisma.util";

export const prismaMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	req.db = prisma;
	next();
};
