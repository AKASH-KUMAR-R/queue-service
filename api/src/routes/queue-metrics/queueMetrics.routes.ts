import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";

const router = Router();

router.get(
	"/search",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	commonController.search,
);

export default router;
