import type { NextFunction, Request, Response } from "express";
import zod from "zod";

const validationMiddleware = (schema: zod.ZodTypeAny) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({
				errors: result.error,
			});
		}
		req.body = result.data;
		next();
	};
};

const validateId = (req: Request, res: Response, next: NextFunction) => {
	const schema = zod.object({
		id: zod.uuid(),
	});
	const result = schema.safeParse(req.params);

	if (result.success === false) {
		return res.status(400).json({
			errors: result.error,
		});
	}
	next();
};

export { validationMiddleware, validateId };
