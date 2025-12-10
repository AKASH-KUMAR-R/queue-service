import jwt, { type JwtPayload } from "jsonwebtoken";

import { VERIFY_JWT_STATUS } from "@common/types/jwt";

type VERIFY_JWT_RETURN = {
	status: VERIFY_JWT_STATUS;
	payload?: string | JwtPayload | null;
};

const generateToken = (payload: object, options?: object): string => {
	return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

const verifyToken = (token: string): VERIFY_JWT_RETURN => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		return {
			status: VERIFY_JWT_STATUS.VERIFIED,
			payload: decoded,
		};
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			const decoded = jwt.decode(token);
			return { status: VERIFY_JWT_STATUS.EXPIRED, payload: decoded };
		} else {
			return { status: VERIFY_JWT_STATUS.INVALID, payload: null };
		}
	}
};

export { generateToken, verifyToken };
