import type { CookieOptions, Request, Response } from "express";

import { DAY_IN_MILLISECONDS, MINUTES_IN_MILLISECOND } from "lib/time";

import { VERIFY_JWT_STATUS } from "@common/types/jwt";

import type { UserLoginRequestType } from "@models/user/requests/UserLoginRequest";
import type { UserSignUpRequestType } from "@models/user/requests/UserSignUpRequest";

import userService from "@services/user/user.service";

import { compareText, hashText } from "@utils/bcrypt.util";
import { handleError } from "@utils/error.util";
import { generateToken, verifyToken } from "@utils/jwt.util";

const cookieOptions = (maxAge?: number): CookieOptions => {
	const isProduction = process.env.NODE_ENV === "production";

	return {
		httpOnly: true,
		secure: true,
		sameSite: isProduction ? "none" : "none",
		path: "/",
		...(maxAge ? { maxAge } : {}),
	};
};

const login = async (req: Request, res: Response) => {
	try {
		const { identifier, password } = req.body as UserLoginRequestType;

		const user = await userService.findUserByEmailWithPassword(
			req.db,
			identifier,
		);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid Credentials",
			});
		}

		const isValidPassword = await compareText(password, user.password);

		if (!isValidPassword) {
			return res.status(400).json({
				success: false,
				message: "Invalid Credentials",
			});
		}

		const accessToken = generateToken(
			{
				userId: user.id,
			},
			{ expiresIn: "15m" },
		);

		const refreshToken = generateToken(
			{
				userId: user.id,
			},
			{ expiresIn: "7d" },
		);

		res.cookie(
			"accessToken",
			accessToken,
			cookieOptions(MINUTES_IN_MILLISECOND * 15),
		);

		res.cookie(
			"refreshToken",
			refreshToken,
			cookieOptions(DAY_IN_MILLISECONDS * 7),
		);

		const { password: _, ...userWithoutPassword } = user;

		res.status(200).json({
			user: userWithoutPassword,
			success: true,
			message: "Login Successful",
		});
	} catch (err) {
		handleError(res, err, 500);
	}
};

const signup = async (req: Request, res: Response) => {
	try {
		// DB will throw error if user with email already exists
		// Also, in order for the @password directive to work, we need to use enhance from zenstack

		const body: UserSignUpRequestType = req.body;

		const hashedPassword = await hashText(body.password);

		const newUser = await userService.createUser(req.db, {
			email: body.email,
			name: body.name,
			password: hashedPassword,
		});

		res.status(201).json({
			success: true,
			message: "User created successfully",
			data: newUser,
		});
	} catch (err) {
		handleError(res, err, 500);
	}
};

const logout = async (_req: Request, res: Response) => {
	try {
		res.clearCookie("accessToken", cookieOptions());
		res.clearCookie("refreshToken", cookieOptions());

		res.status(200).json({
			success: true,
			message: "Logout successful",
		});
	} catch (err) {
		handleError(res, err, 500);
	}
};

const refreshToken = async (req: Request, res: Response) => {
	try {
		const refreshCookieToken = req.cookies.refreshToken;

		if (!refreshCookieToken) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const { status, payload } = verifyToken(refreshCookieToken);

		if (
			status === VERIFY_JWT_STATUS.EXPIRED ||
			status === VERIFY_JWT_STATUS.INVALID
		) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const userId = (payload as { userId: string }).userId;

		const user = await userService.findUserById(req.db, userId);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const newAccessToken = generateToken(
			{
				userId,
			},
			{ expiresIn: "15m" },
		);

		res.cookie(
			"accessToken",
			newAccessToken,
			cookieOptions(MINUTES_IN_MILLISECOND * 15),
		);

		res.status(200).json({
			success: true,
			message: "Token refreshed successfully",
		});
	} catch (err) {
		handleError(res, err, 500);
	}
};

export default {
	login,
	signup,
	logout,
	refreshToken,
};
