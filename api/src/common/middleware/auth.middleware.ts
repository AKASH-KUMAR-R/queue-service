import type { Request, Response, NextFunction } from "express";
import { handleError } from "../../utils/error.util";
import { generateToken, verifyToken } from "../../utils/jwt.util";
import userService from "../../services/user/user.service";
import { prisma } from "../../utils/prisma.util";
import { VERIFY_JWT_STATUS } from "../types/jwt";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const accessToken = req.cookies.accessToken;
		const refreshToken = req.cookies.refreshToken;
		let userId = null;

		if (accessToken) {
			const accessTokenResult = verifyToken(accessToken);

			if (accessTokenResult.status === VERIFY_JWT_STATUS.VERIFIED) {
				userId = (accessTokenResult.payload as any).userId;
			}
		}

		if (!userId && refreshToken) {
			const refreshTokenResult = verifyToken(refreshToken);
			if (refreshTokenResult.status === VERIFY_JWT_STATUS.VERIFIED) {
				userId = (refreshTokenResult.payload as any).userId;

				res.cookie(
					"accessToken",
					generateToken({ userId }, { expiresIn: "15m" }),
					{
						httpOnly: true,
						secure: true,
						sameSite:
							process.env.NODE_ENV === "production"
								? "lax"
								: "none",
					}
				);
			} else {
				return res.status(401).json({ error: "Unauthorized" });
			}
		}

		if (!userId) {
			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");
			return res.status(401).json({ error: "Unauthorized" });
		}

		const user = await userService.findUserById(prisma, userId);

		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		req.user = user;
		next();
	} catch (err) {
		handleError(res, err, 500);
	}
};
