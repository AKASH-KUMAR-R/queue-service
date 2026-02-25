import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";
import {
	validateId,
	validationMiddleware,
} from "@common/middleware/zod.middleware";

import { UserUpdateRequest } from "@models/user/requests/UserUpdateRequest";

import userController from "@controllers/user/user.controller";

const router = Router();

router.get(
	"/list",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	commonController.list,
);
router.get(
	"/search",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	commonController.search,
);
router.get(
	"/me",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	userController.getCurrentUser,
);
router.get(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	commonController.getById,
);

router.put(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	validationMiddleware(UserUpdateRequest),
	commonController.update,
);

router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	commonController.remove,
);
export default router;
