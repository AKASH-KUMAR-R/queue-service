import { Router } from "express";

import passport from "@config/passport.config";

import commonController from "@common/controller/common.controller";
import { attachPrismaContext } from "@common/middleware/prisma.middleware";
import {
	queryValidationMiddleware,
	validateId,
} from "@common/middleware/zod.middleware";

import { JobEventsListRequest } from "@models/job/requests/JobEventsListRequest";

import jobDashboardController from "@controllers/job/job.dashboard.controller";

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
	"/:id",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	commonController.getById,
);

router.get(
	"/:id/events",
	passport.authenticate("jwt", { session: false }),
	attachPrismaContext,
	validateId,
	queryValidationMiddleware(JobEventsListRequest),
	jobDashboardController.getJobEvents,
);

export default router;
