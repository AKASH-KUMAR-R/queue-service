import type { Request, Response } from "express";

import userService from "@services/user/user.service";

import { compareText, hashText } from "@utils/bcrypt.util";
import { handleError } from "@utils/error.util";
import { generateToken } from "@utils/jwt.util";

const login = async (req: Request, res: Response) => {
	try {
		const { identifier, password } = req.body;

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

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
		});

		res.status(200).json({
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

		const hashedPassword = await hashText(req.body.password);

		const newUser = await userService.createUser(req.db, {
			email: req.body.email,
			name: req.body.name,
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

export default {
	login,
	signup,
};
