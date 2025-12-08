import type { NextFunction, Request, Response } from "express";
import zod from "zod";

const idParamSchema = zod.object({
	id: zod.uuid(),
});

const validationMiddleware = (schema: zod.ZodType) => {
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

const paramsValidationMiddleware = <T extends zod.ZodType>(schema: T) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.query);

		if (!result.success) {
			return res.status(400).json({
				errors: result.error,
			});
		}

		req.validQuery = result.data;

		next();
	};
};

const validateId = (req: Request, res: Response, next: NextFunction) => {
	const result = idParamSchema.safeParse(req.params);

	if (!result.success) {
		return res.status(400).json({
			errors: result.error,
		});
	}
	next();
};

export { validationMiddleware, validateId, paramsValidationMiddleware };
