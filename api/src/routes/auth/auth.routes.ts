import { Router } from "express";

import { validationMiddleware } from "@common/middleware/zod.middleware";

import { UserLoginRequest } from "@models/user/requests/UserLoginRequest";
import { UserSignUpRequest } from "@models/user/requests/UserSignUpRequest";

import authController from "@controllers/auth/auth.controller";

const router = Router();

router.post(
	"/login",
	validationMiddleware(UserLoginRequest),
	authController.login,
);

router.post(
	"/signup",
	validationMiddleware(UserSignUpRequest),
	authController.signup,
);

router.post("/logout", authController.logout);

export default router;
