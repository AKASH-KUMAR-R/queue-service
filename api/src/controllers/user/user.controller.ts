import type { Request, Response } from "express";

import { handleError } from "@utils/error.util";

const getCurrentUser = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ user: req.user });
	} catch (err) {
		handleError(res, err, 500);
	}
};

export default {
	getCurrentUser,
};
