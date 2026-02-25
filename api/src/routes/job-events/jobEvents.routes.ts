import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";

const router = Router();

// TODO: Add auth middleware after implementing auth routes
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
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	commonController.getById,
);

export default router;
