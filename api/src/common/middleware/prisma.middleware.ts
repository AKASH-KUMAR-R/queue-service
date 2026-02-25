import type { NextFunction, Request, Response } from "express";

import type { User } from "@prisma/client";

import { handleError } from "@utils/error.util";
import { getEnhancedPrisma, prisma } from "@utils/prisma.util";

export const prismaMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	req.db = prisma;
	next();
};

export const attachPrismaContext = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user) {
			throw new Error("Unauthorized");
		}

		req.db = getEnhancedPrisma(req.user as Omit<User, "password">);
		next();
	} catch (err) {
		handleError(res, "Unauthorized", 401);
	}
};
